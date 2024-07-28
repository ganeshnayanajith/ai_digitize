import { IsString, IsNotEmpty } from 'class-validator';

export class AnalyzeDto {
  @IsNotEmpty()
  @IsString()
  readonly batchId: string;
}
