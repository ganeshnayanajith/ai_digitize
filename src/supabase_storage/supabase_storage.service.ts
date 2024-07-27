import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../lib/services/supabase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFileBatchDataEntity } from './uploaded_file_batch_data.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import { FileAnalyzerAIService } from '../../lib/services/file_analyzer_ai.service';

@Injectable()
export class SupabaseStorageService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly fileAnalyzerAIService: FileAnalyzerAIService,
    private readonly configService: ConfigService,
    @InjectRepository(UploadedFileBatchDataEntity)
    private uploadedFileBatchDataRepository: Repository<UploadedFileBatchDataEntity>,
  ) {
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const supabase = this.supabaseService.getSupabaseClient();
    const uploadedFileUrls: string[] = [];

    for (const file of files) {

      const fileNameParts = file.originalname.split('.');

      const { data, error } = await supabase.storage
        .from(this.configService.get('STORAGE_BUCKET_NAME'))
        .upload(`uploads/${fileNameParts[0]}_${Date.now()}.${fileNameParts[1]}`, file.buffer);

      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from(this.configService.get('STORAGE_BUCKET_NAME'))
        .getPublicUrl(data.path);


      if (!publicUrl) {
        throw new Error(`Failed to get public file url`);
      }

      uploadedFileUrls.push(publicUrl);
    }

    const batchId = uuidV4();

    const fileEntity = this.uploadedFileBatchDataRepository.create({ batchId, uploadedFileUrls });

    await this.uploadedFileBatchDataRepository.save(fileEntity);

    return { batchId, uploadedFileUrls };
  }

  async analyzeFiles(files: Express.Multer.File[], batchId) {
    const aiResult = await this.fileAnalyzerAIService.analyzeFiles(files);

    const batch = await this.uploadedFileBatchDataRepository.findOneBy({ batchId });

    if (!batch) {
      throw new NotFoundException(`Batch with id ${batchId} not found`);
    }

    Object.assign(batch, { aiResult });

    return await this.uploadedFileBatchDataRepository.save(batch);
  }
}
