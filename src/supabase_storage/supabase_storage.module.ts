import { Module } from '@nestjs/common';
import { SupabaseStorageController } from './supabase_storage.controller';
import { SupabaseStorageService } from './supabase_storage.service';
import { SupabaseService } from '../../lib/services/supabase.service';
import { ConfigService } from '@nestjs/config';
import { UploadedFileBatchDataEntity } from './uploaded_file_batch_data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileAnalyzerAIService } from '../../lib/services/file_analyzer_ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFileBatchDataEntity])],
  controllers: [SupabaseStorageController],
  providers: [SupabaseStorageService, SupabaseService, ConfigService, FileAnalyzerAIService],
})
export class SupabaseStorageModule {
}
