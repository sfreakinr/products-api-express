const express = require('express')
const path = require('path')
const productRouter = require('./routes/productRouter')
const {myLogger} = require('./middleware/logger')


const app=express()

app.use(express.json())
app.use('/products',productRouter)


app.get('/',(req,res)=>{
    // res.send("From the server")
    // res.sendFile(path.join(__dirname,"/index.html"))
})



app.listen(3000,()=>{
    console.log("Server Started...")
})

