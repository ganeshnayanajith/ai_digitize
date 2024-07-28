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

    const batchId = uuidV4();

    const results = [];

    for (const file of files) {

      const fileNameParts = file.originalname.split('.');

      const fileName = `${fileNameParts[0]}_${Date.now()}.${fileNameParts[1]}`;

      const { data, error } = await supabase.storage
        .from(this.configService.get('STORAGE_BUCKET_NAME'))
        .upload(`uploads/${fileName}`, file.buffer);

      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      const { data: { publicUrl: fileUrl } } = supabase
        .storage
        .from(this.configService.get('STORAGE_BUCKET_NAME'))
        .getPublicUrl(data.path);


      if (!fileUrl) {
        throw new Error(`Failed to get public file url`);
      }

      const fileEntity = this.uploadedFileBatchDataRepository.create({ batchId, fileUrl, fileName });

      const result = await this.uploadedFileBatchDataRepository.save(fileEntity);

      results.push(result);
    }

    return results;
  }

  async analyzeFiles(batchId) {

    const batches = await this.uploadedFileBatchDataRepository.findBy({ batchId });

    if (batches.length === 0) {
      throw new NotFoundException(`Batches with id ${batchId} not found`);
    }

    const results = [];

    for (const batch of batches) {

      const aiResult = await this.fileAnalyzerAIService.analyzeFile(batch.fileUrl);

      Object.assign(batch, { aiResult });

      const result = await this.uploadedFileBatchDataRepository.save(batch);

      results.push(result);

    }

    return results;

  }
}
