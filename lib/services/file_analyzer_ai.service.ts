import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileAnalyzerAIService {

  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  async analyzeFiles(files: Express.Multer.File[]): Promise<any> {

    const data = new FormData();

    files.forEach((file) => {
      data.append('files', file.buffer, file.originalname);
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: this.configService.get('AI_SERVICE_URL'),
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
