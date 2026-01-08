import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate only the request body
      const validatedData = await schema.parseAsync(req.body);

      // Overwrite req.body with validated data
      req.body = validatedData;

      next();
    } catch (error: any) {
      console.log("error from validate middleware", typeof error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: JSON.parse(error.message),
        });
      }
      // Return validation errors
      res.status(400).json({
        success: false,
        message: error.errors || error.message,
      });
    }
  };
};
