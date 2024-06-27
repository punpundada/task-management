import express from 'express';
import env from './utils/env';
import { STATUS_CODES } from './utils/lib';
import authRouter from './routes/auth';
import { userRouter } from './routes/user';
import errorHandler from './middleware/errorHandler';
import { validateSession } from './middleware/authMiddleware';

const app = express();

app.use(express.urlencoded())
app.use(express.json())

app.get("/api/health-check",(req,res)=>{
    return res.status(STATUS_CODES.OK).json({
        healthy:true
    })
})

app.use(validateSession)
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.use(errorHandler)

app.listen(env.PORT,()=>{
    console.log(`Server started on ${env.BASE_URL}`)
})