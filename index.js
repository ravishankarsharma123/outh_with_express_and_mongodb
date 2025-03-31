import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import db from './utils/db.js'
import cookieParser from 'cookie-parser'
// import userRouter from './routes/user.js'
// import postRouter from './routes/post.js'



//importing routes
import userRoutes from './routes/user.routes.js'



dotenv.config()

// Connect to MongoDB
db()






const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use (express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        mathods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials : true
    })
)
app.use(express.json())
app.use(express.urlencoded({extended: true}))






app.get('/api', (req, res) =>{
    res.send('API')
})

// user routes
app.use('/api/v1/users', userRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`)
})
