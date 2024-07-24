import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseStorageModule } from './supabase_storage/supabase_storage.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    SupabaseStorageModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        SUPABASE_ANON: Joi.string().required(),
        SUPABASE_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
