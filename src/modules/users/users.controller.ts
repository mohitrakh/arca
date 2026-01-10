import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/api-response';
import { registerUser, loginUser, getUserDetails } from './users.service';
import { RegisterUserInput, LoginUserInput } from './users.schema';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as RegisterUserInput;
        const user = await registerUser(body.name, body.email, body.password);
        return ApiResponse.success(res, user, 'User registered successfully', 201);
    } catch (err) {
        next(err);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as LoginUserInput;
        const result = await loginUser(body.email, body.password);
        return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
        next(err);
    }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.userId
        const result = await getUserDetails(userId)
        return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
        next(err);
    }
};

export {
    register,
    login,
    getMe
};
