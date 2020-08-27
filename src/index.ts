import express from 'express';
import { userRouter } from './routes/userRouter';
import dotenv from 'dotenv';
import cors from 'cors';
import { genreRouter } from './routes/genreRouter';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/genre", genreRouter);

export default app;