import { Injectable } from '@nestjs/common';
import { createWorker, Worker } from 'tesseract.js';

@Injectable()
export class OcrService {
  async processImage(file: Express.Multer.File): Promise<any> {
    // Membuat worker dari Tesseract.js dan menunggu pekerjaannya selesai
    const worker: Worker = await createWorker();

    try {
      // Memuat worker dan model OCR
      await worker.load();

      // Menggunakan model OCR yang sudah diload untuk mengenali teks dari gambar
      const { data } = await worker.recognize(file.buffer);

      // Menangkap teks hasil OCR
      const ocrText = data.text;

      // Mendapatkan informasi yang relevan dari teks OCR (misalnya, mencari data gizi)
      const nutritionData = this.extractNutritionData(ocrText);

      // Mengembalikan struktur data yang diinginkan bersama dengan hasil OCR mentah
      return {
        raw_ocr_text: ocrText, // Menyertakan hasil OCR mentah
        data: nutritionData, // Menyertakan data yang telah difilter
      };
    } catch (error) {
      throw new Error('OCR processing failed: ' + error.message);
    } finally {
      // Menutup worker setelah selesai
      await worker.terminate();
    }
  }

  private extractNutritionData(text: string): any {
    // Logika untuk mengekstrak data gizi dari teks OCR
    const calories = this.extractValue(text, 'Calories');
    const sugar = this.extractValue(text, 'Sugars');
    const fats = this.extractValue(text, 'Fat');
    const salt = this.extractValue(text, 'Sodium');
    const dateAdded = new Date().toISOString(); // Ganti ini sesuai dengan tanggal yang relevan, jika ada

    return {
      calories,
      sugar,
      fats,
      salt,
      date_added: dateAdded,
    };
  }

  private extractValue(text: string, key: string): string {
    // Fungsi untuk mengekstrak nilai berdasarkan key (misalnya, mencari "calories", "sugar", dll.)
    const regex = new RegExp(`${key}\\s*([\\d\\.]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1] : '0'; // Kembalikan '0' jika nilai tidak ditemukan
  }
}
