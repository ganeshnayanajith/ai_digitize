import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class UploadedFileBatchDataEntity {
  @PrimaryGeneratedColumn('uuid')
  batchId: string;

  @Column('simple-array')
  filePaths: string[];

  constructor() {
    this.batchId = uuidv4();
  }
}
