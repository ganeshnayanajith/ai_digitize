import { Module } from '@nestjs/common';
import { FileAnalyzeService } from './file_analyze.service';
import { FileAnalyzeAiController } from './file_analyze.controller';
import { FileAnalyzerAIService } from '../../lib/services/file_analyzer_ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFileBatchDataEntity } from '../supabase_storage/uploaded_file_batch_data.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFileBatchDataEntity])],
  controllers: [FileAnalyzeAiController],
  providers: [FileAnalyzeService, FileAnalyzerAIService, ConfigService],
})
export class FileAnalyzeModule {
}
