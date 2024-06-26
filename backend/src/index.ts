import express from 'express';
import env from './utils/env';
import { STATUS_CODES } from './utils/lib';
import authRouter from './routes/auth';
import { userRouter } from './routes/user';

const app = express();

app.get("/health-check",(req,res)=>{
    return res.status(STATUS_CODES.OK).json({
        healthy:true
    })
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(env.PORT,()=>{
    console.log(`Server started on ${env.BASE_URL}`)
})