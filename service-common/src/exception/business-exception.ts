type BusinessExceptionContext = {
  code: string;
  message: string;
  tag?: ErrorTag;
  details?: Record<string, unknown>;
};

export enum ErrorTag {
  NOT_FOUND = 0,
  BAD_VALIDATION = 1,
  ALREADY_EXISTS = 2,
  INTERNAL_SERVICE_ERROR = 3,
}

export class BusinessException extends Error {
  static readonly BUSINESS_CODE_ID = 'business_code';

  tag: ErrorTag;
  code: string;
  details?: Record<string, unknown>;

  constructor({ code, message, details, tag }: BusinessExceptionContext) {
    super(message);
    this.code = code;
    this.details = details;
    this.tag = tag ?? ErrorTag.INTERNAL_SERVICE_ERROR;
  }
}

export class InvalidArgumentException extends BusinessException {
  constructor(exceptionContent: Omit<BusinessExceptionContext, 'tag'>) {
    super({
      tag: ErrorTag.BAD_VALIDATION,
      ...exceptionContent
    });
  }
}

export class NotFoundException extends BusinessException {
  constructor(exceptionContent: Omit<BusinessExceptionContext, 'tag'>) {
    super({
      tag: ErrorTag.NOT_FOUND,
      ...exceptionContent,
    });
  }
}

export class ExistedException extends BusinessException {
  constructor(exceptionContent: Omit<BusinessExceptionContext, 'tag'>) {
    super({
      tag: ErrorTag.ALREADY_EXISTS,
      ...exceptionContent,
    });
  }
}
