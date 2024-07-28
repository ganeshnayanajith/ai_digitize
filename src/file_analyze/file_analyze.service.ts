import { Injectable, NotFoundException } from '@nestjs/common';
import { FileAnalyzerAIService } from '../../lib/services/file_analyzer_ai.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFileBatchDataEntity } from '../supabase_storage/uploaded_file_batch_data.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileAnalyzeService {

  constructor(
    private readonly fileAnalyzerAIService: FileAnalyzerAIService,
    @InjectRepository(UploadedFileBatchDataEntity)
    private uploadedFileBatchDataRepository: Repository<UploadedFileBatchDataEntity>,
  ) {
  }

  async analyzeFiles(batchId) {

    const batches = await this.uploadedFileBatchDataRepository.findBy({ batchId });

    if (batches.length === 0) {
      throw new NotFoundException(`Batches with id ${batchId} not found`);
    }

    const results = [];

    for (const batch of batches) {

      const aiResult = await this.fileAnalyzerAIService.analyzeFile(batch.fileUrl);

      Object.assign(batch, { aiResult });

      const result = await this.uploadedFileBatchDataRepository.save(batch);

      results.push(result);

    }

    return results;

  }

  async getAnalyzedData(batchId) {

    const batches = await this.uploadedFileBatchDataRepository.findBy({ batchId });

    if (batches.length === 0) {
      throw new NotFoundException(`Batches with id ${batchId} not found`);
    }

    return batches;

  }

}
