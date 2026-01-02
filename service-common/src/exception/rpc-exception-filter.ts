import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from "@nestjs/common";
import { Metadata, status } from "@grpc/grpc-js";
import { Observable, throwError } from "rxjs";
import { BusinessException, ErrorTag } from "./business-exception";

@Catch()
export class RpcServiceExceptionFilter
  implements RpcExceptionFilter<BusinessException | Error>
{
  private readonly logger = new Logger(RpcServiceExceptionFilter.name);

  catch(
    exception: BusinessException | Error,
    host: ArgumentsHost,
  ): Observable<any> {
    if (exception instanceof BusinessException) {
      const metadata = new Metadata();
      metadata.set(BusinessException.BUSINESS_CODE_ID, exception.code);

      const message = {
        code: this.mapTagToRPCCode(exception.tag),
        message: exception.message,
        details: JSON.stringify(exception.details),
        metadata,
      };

      return throwError(() => message);
    }

    const message = {
      code: this.mapTagToRPCCode(ErrorTag.INTERNAL_SERVICE_ERROR),
      message: exception.message,
      details: JSON.stringify(exception),
    };

    return throwError(() => message);
  }

  private mapTagToRPCCode(tag: ErrorTag): number {
    switch (tag) {
      case ErrorTag.INTERNAL_SERVICE_ERROR:
        return status.INTERNAL;
      case ErrorTag.NOT_FOUND:
        return status.NOT_FOUND;
      case ErrorTag.BAD_VALIDATION:
        return status.INVALID_ARGUMENT;
      case ErrorTag.ALREADY_EXISTS:
        return status.ALREADY_EXISTS;
      default:
        return status.INTERNAL;
    }
  }
}
