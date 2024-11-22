import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/ocr-food')
export class OcrController {
  // Temporary in-memory storage for OCR data with associated ids
  private ocrDataStore: { [key: string]: any } = {};

  constructor(private readonly ocrService: OcrService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const text = await this.ocrService.processImage(file);

      // Generate a unique ID (first 6 characters of UUID)
      const id = uuidv4().slice(0, 6);

      // Store the OCR result with the generated ID
      this.ocrDataStore[id] = text;

      // Return the OCR data with the generated ID in the response
      return res.status(HttpStatus.OK).json({
        id,
        text,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'OCR processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getOcrDataById(@Param('id') id: string, @Res() res: Response) {
    if (!id) {
      throw new HttpException('ID must be provided', HttpStatus.BAD_REQUEST);
    }

    const ocrData = this.ocrDataStore[id];

    if (!ocrData) {
      throw new HttpException(
        'OCR data not found for the provided ID',
        HttpStatus.NOT_FOUND,
      );
    }

    // Return the OCR data for the specified id
    return res.status(HttpStatus.OK).json({
      id,
      text: ocrData,
    });
  }

  @Get()
  async getAllOcrData(@Res() res: Response) {
    if (Object.keys(this.ocrDataStore).length === 0) {
      throw new HttpException('No OCR data available', HttpStatus.NOT_FOUND);
    }

    // Return all stored OCR data with their associated IDs
    const ocrDataWithIds = Object.keys(this.ocrDataStore).map((id) => ({
      id,
      text: this.ocrDataStore[id],
    }));

    return res.status(HttpStatus.OK).json(ocrDataWithIds);
  }
}
