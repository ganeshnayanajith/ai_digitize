import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UploadedFileBatchDataEntity {
  @PrimaryGeneratedColumn('uuid')
  batchId: string;

  @Column('simple-array')
  uploadedFileUrls: string[];

  @Column({ type: 'jsonb', nullable: true })
  aiResult: any;
}
