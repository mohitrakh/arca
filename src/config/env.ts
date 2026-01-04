const env = {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET || 'mohitrakh11',
    dbUrl: process.env.DATABASE_URL
}

export default env