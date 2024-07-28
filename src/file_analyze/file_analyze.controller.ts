import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { FileAnalyzeService } from './file_analyze.service';
import { SuccessResponse } from '../../lib/responses/success.response';
import { ErrorResponse } from '../../lib/responses/error.response';

@Controller('file-analyze')
export class FileAnalyzeAiController {
  constructor(private readonly fileAnalyzeService: FileAnalyzeService) {}

  @Get('analyze/:batchId')
  async analyzeFiles(
    @Param('batchId') batchId: string,
    @Res() res: Response,
  ) {
    try {

      const result = await this.fileAnalyzeService.analyzeFiles(batchId);

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
