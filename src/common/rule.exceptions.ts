import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(status: number, message: string) {
    super({ message, status }, status);
  }
}