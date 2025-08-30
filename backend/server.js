import express from 'express';
const app = express()

const port = 8080

app.get("/", (req, res) => res.send("Execute"))

app.listen(port, () =>{
    console.log(`L'execution du server sur le port ${port}`)
})

