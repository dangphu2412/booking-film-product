import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Metadata, status } from "@grpc/grpc-js";
import { FastifyReply, FastifyRequest } from "fastify";
import { BusinessException, ErrorTag } from "./business-exception";

type HttpGatewayExceptionContext = {
  code: string;
  tag: ErrorTag;
  businessCode: string;
  message: string;
  details?: Record<string, unknown>;
  metadata: Metadata;
};

@Catch()
export class HttpGatewayExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpGatewayExceptionFilter.name);

  catch(
    exception: HttpGatewayExceptionContext | HttpException | Error,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (this.isBusinessException(exception)) {
      const businessCode = exception.metadata.get(
        BusinessException.BUSINESS_CODE_ID,
      )[0];

      const httpStatus = this.mapRPCToHTTPStatus(
        Number.parseInt(exception.code),
      );

      return response.status(httpStatus).send({
        statusCode: httpStatus,
        businessCode: businessCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    this.logger.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private isBusinessException(
    exception: unknown,
  ): exception is HttpGatewayExceptionContext {
    if (!(exception as HttpGatewayExceptionContext).metadata) return false;

    return !!(exception as HttpGatewayExceptionContext).metadata.get(
      BusinessException.BUSINESS_CODE_ID,
    ).length;
  }

  private mapRPCToHTTPStatus(rpcCode: number): HttpStatus {
    switch (rpcCode) {
      case status.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case status.ALREADY_EXISTS:
        return HttpStatus.CONFLICT;
      case status.INVALID_ARGUMENT:
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
