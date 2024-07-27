import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../lib/services/supabase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFileBatchDataEntity } from './uploaded_file_batch_data.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStorageService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    @InjectRepository(UploadedFileBatchDataEntity)
    private uploadedFileBatchDataRepository: Repository<UploadedFileBatchDataEntity>,
  ) {
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const supabase = this.supabaseService.getSupabaseClient();
    const uploadedFiles: string[] = [];

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

      uploadedFiles.push(publicUrl);
    }

    const fileEntity = this.uploadedFileBatchDataRepository.create({ fileUrls: uploadedFiles });
    await this.uploadedFileBatchDataRepository.save(fileEntity);

    return uploadedFiles;
  }
}
