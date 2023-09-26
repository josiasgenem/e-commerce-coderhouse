export const httpStatusCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
}

export class BaseError extends Error {
    constructor(name, statusCode, isOperational, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends BaseError {
    constructor(message = 'Resource not found!') {
        super('NOT_FOUND', httpStatusCodes.NOT_FOUND, true, message);
    }
}

export class BadRequestError extends BaseError {
    constructor(message = 'Bad Request!') {
        super('BAD_REQUEST', httpStatusCodes.BAD_REQUEST, true, message);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'You must to be logged in to access to this resource!') {
        super('UNAUTHORIZED', httpStatusCodes.UNAUTHORIZED, true, message);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message = 'You do not have access rights to this resource!') {
        super('FORBIDDEN', httpStatusCodes.FORBIDDEN, true, message);
    }
}

export class ServerError extends BaseError {
    constructor(message = 'Something went wrong, try again in some minutes please!') {
        super('INTERNAL_SERVER', httpStatusCodes.INTERNAL_SERVER, false, message);
    }
}