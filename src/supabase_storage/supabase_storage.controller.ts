import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException, Res, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SupabaseStorageService } from './supabase_storage.service';
import { ErrorResponse } from '../../lib/responses/error.response';
import { SuccessResponse } from '../../lib/responses/success.response';

@Controller('supabase-storage')
export class SupabaseStorageController {

  constructor(private readonly supabaseStorageService: SupabaseStorageService) {
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded.');
      }

      const result = await this.supabaseStorageService.uploadFiles(files);

      SuccessResponse.sendSuccessResponse(
        res,
        HttpStatus.OK,
        result,
        'File uploaded successfully.',
      );
    } catch (err) {
      ErrorResponse.sendErrorResponse(res, err);
    }
  }

  @Post('analyze')
  @UseInterceptors(FilesInterceptor('files', 10))
  async analyzeFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded.');
      }

      const result = await this.supabaseStorageService.analyzeFiles(files);

      SuccessResponse.sendSuccessResponse(
        res,
        HttpStatus.OK,
        result,
        'File analyzed successfully.',
      );
    } catch (err) {
      ErrorResponse.sendErrorResponse(res, err);
    }
  }

}