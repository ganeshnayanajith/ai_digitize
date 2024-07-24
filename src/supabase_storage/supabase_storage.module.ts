import { Module } from '@nestjs/common';
import { SupabaseStorageController } from './supabase_storage.controller';
import { SupabaseStorageService } from './supabase_storage.service';
import { SupabaseService } from '../../lib/services/supabase.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [SupabaseStorageController],
  providers: [SupabaseStorageService, SupabaseService, ConfigService],
})
export class SupabaseStorageModule {
}
