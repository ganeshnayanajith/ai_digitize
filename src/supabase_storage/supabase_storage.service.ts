import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../lib/services/supabase.service';

@Injectable()
export class SupabaseStorageService {
  constructor(private readonly supabaseService: SupabaseService) {
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const supabase = this.supabaseService.getSupabaseClient();
    const uploadedFiles: string[] = [];

    for (const file of files) {

      const fileNameParts = file.originalname.split('.');

      const { data, error } = await supabase.storage
        .from('uploaded_files')
        .upload(`uploads/${fileNameParts[0]}_${Date.now()}.${fileNameParts[1]}`, file.buffer);

      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      uploadedFiles.push(data.path);
    }

    return uploadedFiles;
  }
}
