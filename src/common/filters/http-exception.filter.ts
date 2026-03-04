import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { CustomException } from "../rule.exceptions";


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {

    console.log('Exception capturée par HttpExceptionFilter:', exception);
   
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof CustomException) {
      status = exception.getStatus();
      message = exception.message;
      error = this.statusToError(status);

    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();

      message = typeof body === 'string' ? body : (body as any).message ?? exception.message;
      error = this.statusToError(status);
    } else {
      // Erreur interne non anticipée
      status = 500;
      error = 'Internal Server Error';
      message = 'An unexpected error occurred. Please contact support.';
      // Détail de l'erreur loggé côté serveur uniquement — jamais exposé au client
      this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

   private statusToError(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Unprocessable Entity';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}