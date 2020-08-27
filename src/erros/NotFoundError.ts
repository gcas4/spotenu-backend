import { CustomError } from "./base/CustomError";

export class NotFoundError extends CustomError {
    statusCode: number = 404;
}