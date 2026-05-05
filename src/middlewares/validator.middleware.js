import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().forEach((err) => {
        extractedErrors.push({ [err.path]: err.msg });
    });

    return next(new ApiError(422, "Received invalid data", extractedErrors));
};

export { validatorMiddleware };