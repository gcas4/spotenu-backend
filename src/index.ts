import express from 'express';
import { userRouter } from './routes/userRouter';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/user", userRouter);

export default app;