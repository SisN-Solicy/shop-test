import dotenv from 'dotenv';

dotenv.config();

export default {
    JWT_SECRET: process.env.JWT_SECRET as string,
    PORT: process.env.PORT as string,
    BASE_URL: process.env.BASE_URL as string
};
