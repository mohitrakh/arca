import express from 'express';
import { validate } from '../../middleware/validate';
import { register, login, getMe } from './users.controller';
import { registerUserSchema, loginUserSchema } from './users.schema';
import { requireAuth } from '../../middleware/require-auth';

const userRouter = express.Router();

userRouter.post('/register', validate(registerUserSchema), register);
userRouter.post('/login', validate(loginUserSchema), login);
userRouter.get('/me', requireAuth, getMe);
userRouter.get('/xyz', (req, res) => {
    res.json({
        message: "Hello Mom"
    })
});


export default userRouter;
