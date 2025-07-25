import * as AWS from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { IFileService } from '../files.adapter';
import { S3Lib } from './constants/do-spaces-service-lib.constant';
import { UploadException } from './exceptions/upload.exception';
import { UploadFilePayloadDto } from './dto/upload-file-payload.dto';
import { UploadFileResultDto } from './dto/upload-file-result.dto';
import { RemoveFilePayloadDto } from './dto/remove-file-payload.dto';
import { RemoveException } from './exceptions/remove.exception';

@Injectable()
export class S3Service extends IFileService {
  private readonly logger = new Logger(S3Service.name);

  // TODO: укажи имя бакета
  private readonly bucketName = 'admin';

  constructor(@Inject(S3Lib) private readonly S3: AWS.S3) {
    super();
  }

  async uploadFile(dto: UploadFilePayloadDto): Promise<UploadFileResultDto> {
    const { folder, file, name } = dto;
    const path = `${folder}/${name}`;

    this.logger.log('📁 Beginning of uploading file to bucket');

    return new Promise((resolve, reject) => {
      this.S3.putObject(
        {
          Bucket: this.bucketName,
          Key: path,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        },
        (error) => {
          if (!error) {
            this.logger.log('✅ Uploading was successful');
            resolve({
              path,
            });
          } else {
            this.logger.error(`❌ File upload error with path: ${path}`);
            const message = error instanceof Error ? error.message : 'Unknown error';
            reject(new UploadException(message));
          }
        },
      );
    });
  }

  async removeFile(dto: RemoveFilePayloadDto): Promise<void> {
    const { path } = dto;

    this.logger.log('🗑️ Beginning of removing file from bucket');

    return new Promise((resolve, reject) => {
      this.S3.deleteObject(
        {
          Bucket: this.bucketName,
          Key: path,
        },
        (error) => {
          console.log(error);
          if (!error) {
            this.logger.log('✅ Removing was successful');
            resolve();
          } else {
            this.logger.error(`❌ File remove error with path: ${path}`);
            const message = error instanceof Error ? error.message : 'Unknown error';
            reject(new RemoveException(message));
          }
        },
      );
    });
  }
}
