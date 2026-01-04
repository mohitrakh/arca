import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

type ValidationSource = 'body' | 'params' | 'query';

export const validate =
    <T>(schema: ZodSchema<T>, source: ValidationSource = 'body') =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req[source]);

            if (!result.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: result.error.flatten(),
                });
            }

            // 🔑 overwrite with validated & typed data
            req[source] = result.data as any;
            next();
        };
