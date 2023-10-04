import { BaseError, ServerError } from "../config/errors.js"
import { logger } from "../utils/logger.js";

class ErrorHandler {
    async handleError(error, req, res, next) {
        let err = error;
        if (!this.isTrustedError(err)) err = new ServerError(err.message, err);
        if (!err.isOperational) {
            // TODO: DO SOMETHING TO LOG ERROR WITH A LOGGER OR SOMETHING SIMILAR.
            console.log(err.data, 'ERROR.DATA FROM CONSOLE');
            logger.error(err.message, err);
        }
        let payload = err.data ?
            {message: err.message} :
            {message: err.message, data: err.data};

        return res.status(err.statusCode).json(payload);
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}

export const errorHandler = new ErrorHandler();