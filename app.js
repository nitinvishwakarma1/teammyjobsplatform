import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import candidateRouter from './routes/candidateRouter.js';
import recruiterRouter from './routes/recruiterRouter.js';
import adminRouter from './routes/adminRouter.js';
import vacancyRouter from './routes/vacancyRouter.js';
import appliedVacancyRouter from './routes/appliedVacancyRouter.js';
import { connectDB } from './model/connection.js';

const app = express();
connectDB();
dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/candidate", candidateRouter);
app.use('/recruiter', recruiterRouter)
app.use("/vacancy", vacancyRouter);
app.use("/appliedvacancy", appliedVacancyRouter);



app.listen(process.env.PORT, () => console.log('Server Connection Successfull ..!'));