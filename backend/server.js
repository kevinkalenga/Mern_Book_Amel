import express from 'express';
import productRoutes from './routes/productRoutes.js'
const app = express()

const port = 8080

// routes 
app.use("/api/products", productRoutes)


app.get("/", (req, res) => res.send("Execute"))

app.listen(port, () =>{
    console.log(`L'execution du server sur le port ${port}`)
})

