import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleInputErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400);
        res.json({ errors: error.array() });
    } else {
        next();
    }
};
