import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
const app = express()

const port = process.env.PORT || 8081
connectDB()

// routes 
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)


app.get("/", (req, res) => res.send("Execute"))

app.listen(port, () =>{
    console.log(`L'execution du server sur le port ${port}`)
})

