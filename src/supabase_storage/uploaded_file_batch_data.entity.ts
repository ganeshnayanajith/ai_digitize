import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity()
export class UploadedFileBatchDataEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  batchId: string;

  @Column('text')
  fileName: string;

  @Column('text')
  fileUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  aiResult: any;

  constructor() {
    this.id = uuidV4();
  }
}
