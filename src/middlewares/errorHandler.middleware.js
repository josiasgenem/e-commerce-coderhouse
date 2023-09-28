import { BaseError, ServerError } from "../config/errors.js"

class ErrorHandler {
    async handleError(error, req, res, next) {
        let err = error;
        if (!this.isTrustedError(err)) err = new ServerError(err);
        if (!err.isOperational) {
            // TODO: DO SOMETHING TO LOG ERROR WITH A LOGGER OR SOMETHING SIMILAR.
            console.log(err, '\x1b[31m---> ########## ¡NO OPERATIONAL SERVER ERROR! ##########\x1b[0m');
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