import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { Buffer } from 'buffer';

@Injectable()
export class FileAnalyzerAIService {

  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  async analyzeFile(fileUrl: string): Promise<any> {

    const data = new FormData();

    const fileBuffer = await this.fetchFileFromURL(fileUrl);
    const fileName = fileUrl.split('/').pop();

    data.append('files', fileBuffer, fileName);

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

  async fetchFileFromURL(fileUrl: string) {
    try {
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      console.error(`Error fetching file from URL: ${fileUrl}`, error);
      throw error;
    }
  }
}
