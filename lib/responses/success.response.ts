export class SuccessResponse {
  static sendSuccessResponse(
    res: any,
    statusCode: number,
    data: any,
    message: string,
  ) {
    res.status(statusCode).send({
      success: true,
      statusCode,
      message,
      data,
    });
  }
}
