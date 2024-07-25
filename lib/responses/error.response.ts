import { HttpStatus, Logger } from '@nestjs/common';

export class ErrorResponse {
  private static readonly logger = new Logger(ErrorResponse.name);

  static sendErrorResponse(res: any, error: any) {
    console.error(`Error :  ${error}`);
    console.error(`Error :  ${JSON.stringify(error)}`);
    this.logger.error(error);
    this.logger.error(JSON.stringify(error));

    let statusCode = error?.status
      ? error.status
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const name = error?.name ? error.name : 'InternalServerError';

    let message = error?.response?.error
      ? error?.response?.error
      : 'Internal Server Error';

    if (error?.name == 'JsonWebTokenError' || error?.name == 'TokenExpiredError') {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = error?.message;
    } else if (error?.name === 'ValidationError') {
      statusCode = HttpStatus.BAD_REQUEST;

      message = 'Validation errors occurred:';

      const errorMessageList = [];

      for (const field in error.errors) {
        errorMessageList.push(`${error.errors[field].message}`);
      }
      message += ' ' + errorMessageList.join(', ');
    }

    const response = {
      success: false,
      statusCode,
      name,
      message,
      error: error?.message ? error.message : error,
      data: null,
    };

    this.logger.error(JSON.stringify(response));

    res.status(statusCode).send(response);
  }
}
