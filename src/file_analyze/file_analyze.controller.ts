import { Controller, Get, Param, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { FileAnalyzeService } from './file_analyze.service';
import { SuccessResponse } from '../../lib/responses/success.response';
import { ErrorResponse } from '../../lib/responses/error.response';
import { AnalyzeDto } from './dto/analyze.dto';

@Controller('file-analyze')
export class FileAnalyzeAiController {
  constructor(private readonly fileAnalyzeService: FileAnalyzeService) {
  }

  @Post()
  async analyzeFiles(
    @Body() analyzeDto: AnalyzeDto,
    @Res() res: Response,
  ) {
    try {

      const result = await this.fileAnalyzeService.analyzeFiles(analyzeDto.batchId);

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

  @Get('/:batchId')
  async getAnalyzedData(
    @Param('batchId') batchId: string,
    @Res() res: Response,
  ) {
    try {

      const result = await this.fileAnalyzeService.getAnalyzedData(batchId);

      SuccessResponse.sendSuccessResponse(
        res,
        HttpStatus.OK,
        result,
        'File analyzed data retrieved successfully.',
      );
    } catch (err) {
      ErrorResponse.sendErrorResponse(res, err);
    }
  }
}
