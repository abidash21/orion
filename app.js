require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');

const authRouter = require('./route/authRoute');
const projectRouter = require('./route/projectRoute');
const userRouter = require('./route/userRoute');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');

const app = express();
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/users', userRouter);

app.use('*',(req,res,next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
})

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});