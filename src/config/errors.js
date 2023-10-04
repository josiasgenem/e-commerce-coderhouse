export const httpStatusCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
}

export class BaseError extends Error {
    constructor(name, statusCode, isOperational, message, data = null) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.data = data;
        
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends BaseError {
    constructor(message = 'Resource not found!', data = null) {
        super('NOT_FOUND', httpStatusCodes.NOT_FOUND, true, message, data);
        
        Error.captureStackTrace(this);
    }
}

export class BadRequestError extends BaseError {
    constructor(message = 'Bad Request!', data = null) {
        super('BAD_REQUEST', httpStatusCodes.BAD_REQUEST, true, message, data);
        
        Error.captureStackTrace(this);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'You must to be logged in to access to this resource!', data = null) {
        super('UNAUTHORIZED', httpStatusCodes.UNAUTHORIZED, true, message, data);
        
        Error.captureStackTrace(this);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message = 'You do not have access rights to this resource!', data = null) {
        super('FORBIDDEN', httpStatusCodes.FORBIDDEN, true, message, data);
        
        Error.captureStackTrace(this);
    }
}

export class ServerError extends BaseError {
    constructor(internalMessage = null, error = null) {
        super('INTERNAL_SERVER', httpStatusCodes.INTERNAL_SERVER, false, 'Something went wrong, try again in some minutes please!', error);
        this.internalMessage = (error ? error?.name + ': ' : '') + internalMessage;
        
        Error.captureStackTrace(this);
    }
}