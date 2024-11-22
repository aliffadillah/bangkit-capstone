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
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as FormData from 'form-data';

@Controller('api/food') // Ensure the controller is registered under the correct path
export class AddFotoController {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService, // Inject JwtService for token verification
  ) {}

  private validateToken(authHeader: string): { username: string } {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('ocr') // This defines the /api/food/ocr endpoint
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndForwardImage(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
    @Res() res: Response,
  ) {
    // Validate JWT
    const payload = this.validateToken(authHeader);

    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      // Forward the file to the machine learning OCR API
      const response = await this.forwardFileToOcrApi(file);

      // Return the response from the OCR API to the client
      return res.status(HttpStatus.OK).json({
        message: 'File processed successfully',
        username: payload.username, // Include username from JWT
        data: response.data,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Error forwarding file to OCR API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async forwardFileToOcrApi(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const ocrApiUrl = 'http://localhost:3000/api/ocr-food';

    const response = await this.httpService
      .post(ocrApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      })
      .toPromise();

    return response;
  }

  @Get('ocr/:id') // This defines the /api/food/ocr/:id endpoint
  async getOcrDataById(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
    @Res() res: Response,
  ) {
    // Validate JWT
    const payload = this.validateToken(authHeader);

    try {
      // Forward the GET request with the ID to the OCR API
      const ocrApiUrl = `http://localhost:3000/api/ocr-food/${id}`;
      const response = await this.httpService.get(ocrApiUrl).toPromise();

      // Return the response from the OCR API to the client
      return res.status(HttpStatus.OK).json({
        message: 'OCR data fetched successfully',
        username: payload.username, // Include username from JWT
        data: response.data,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching OCR data from the ML API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
