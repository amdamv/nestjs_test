import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { RemoveFilePayloadDto } from './dto/remove-file-payload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadedMulterFile } from './interfaces/upload-file.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('S3 Files')
@Controller('files')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({ summary: 'body/form-data - key=file, value= choose-file' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file') file: IUploadedMulterFile) {
    const payload = {
      folder: 'uploads',
      name: file.fieldname,
      file,
    };
    return this.s3Service.uploadFile(payload);
  }

  @ApiOperation({ summary: 'body/raw - "path": "uploads/file-name"' })
  @Delete('delete-file')
  async removeFile(@Body() file: RemoveFilePayloadDto) {
    const res = await this.s3Service.removeFile(file);
    return res;
  }
}
