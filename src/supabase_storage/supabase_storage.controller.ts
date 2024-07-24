import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SupabaseStorageService } from './supabase_storage.service';

@Controller('supabase-storage')
export class SupabaseStorageController {

  constructor(private readonly supabaseStorageService: SupabaseStorageService) {
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    try {
      const uploadedFilePaths = await this.supabaseStorageService.uploadFiles(files);
      return { uploadedFiles: uploadedFilePaths };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}