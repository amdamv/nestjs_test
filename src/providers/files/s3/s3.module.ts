import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3Lib } from './constants/do-spaces-service-lib.constant';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  controllers: [S3Controller],
  providers: [
    S3Service,
    {
      provide: S3Lib,
      useFactory: () => {
        // TODO: укажи только accessKeyId, secretAccessKey
        return new AWS.S3({
          endpoint: 'http://127.0.0.1:9000',
          region: 'us-east-1',
          credentials: {
            accessKeyId: 'minioadmin',
            secretAccessKey: 'minioadmin',
          },
          forcePathStyle: true,
        });
      },
    },
  ],
  exports: [S3Service, S3Lib],
})
export class S3Module {}
