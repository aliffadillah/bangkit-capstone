import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';

@Injectable()
export class GoogleCloudStorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
    });
    this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucket);
    const fileName = path.basename(file.originalname);
    const fileUpload = bucket.file(fileName);

    try {
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      return `https://storage.googleapis.com/${this.bucket}/${fileName}`;
    } catch (error) {
      throw new Error('File upload failed: ' + error.message);
    }
  }
}
