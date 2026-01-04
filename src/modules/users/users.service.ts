
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/app-error';
import { userTable } from '../../db/schema/users';
import { db } from '../../db';
import { eq } from 'drizzle-orm';
import env from '../../config/env';


export const registerUser = async (name: string, email: string, password: string) => {
    // Check if user already exists
    const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
    if (existingUser) throw new AppError('User with this email already exists', 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const user = await db.insert(userTable).values({
        name,
        email,
        password_hash: hashedPassword,
    }).$returningId();

    return user[0];
};

export const loginUser = async (email: string, password: string) => {
    const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        env.jwtSecret,
        { expiresIn: '7d' }
    );

    return { user, token };
};

export const getUserDetails = async (id: string | undefined) => {
    if (!id) {
        throw new AppError('Id is not provided', 400)
    }
    const [user] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);

    if (!user) throw new AppError('Invalid credentials', 401);


    return { user };
};
