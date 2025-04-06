
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/app.config';
import connectDb from './database/database';
import { errorHandler } from './middleware/errorHandler';
import { catchError } from './middleware/catchError';
import authRoutes from './modules/auth/auth.route';
import passport from './middleware/passport';
import sessionRoutes from './session/session.route';
import { authenticateJWT } from './common/strategy/jwt.strategy';
import mfaRoutes from './modules/mfa/mfa.route';

import next from 'next';
import path from 'path'

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev,  dir: path.join(__dirname, '../../frontend') })
const nextHandler = nextApp.getRequestHandler()


const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: config.APP_ORIGIN,
        credentials: true,
    })
);

app.use(cookieParser());
app.use(passport.initialize());

app.get("/", catchError(async (req, res, next) => {
    return res.status(200).json({
        message: "Welcome to the API"
    })
}))

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/mfa`, mfaRoutes)
app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes)
app.use(errorHandler);

nextApp.prepare().then(() => {
    app.all('*', (req, res) => {
        return nextHandler(req, res)
    });
});



app.listen(config.PORT, async () => {
    await connectDb();
    console.log(`Server is running on port ${config.PORT}`);
});