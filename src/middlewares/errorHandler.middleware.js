import { BaseError, ServerError } from "../config/errors"

class ErrorHandler {
    async handleError(error, req, res, next) {
        let err;
        if(error.isOperational) {
            // TODO: DO SOMETHING TO SEND TO CLIENT.
            err = error
        } else {
            // TODO: DO SOMETHING TO LOG ERROR WITH A LOGGER OR SOMETHING SIMILAR.
            err = new ServerError();
            console.log(err);
        }
        return res.status(err.statusCode).json({message: err.message});
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}

export const errorHandler = new ErrorHandler();