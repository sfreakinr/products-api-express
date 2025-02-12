// const express = require('express')
// const path = require('path')
// const productRouter = require('./routes/productRouter')
// const {myLogger} = require('./middleware/logger')


// const app=express()

// app.use(express.json())
// app.use('/products',productRouter)


// app.get('/',(req,res)=>{
//     // res.send("From the server")
//     // res.sendFile(path.join(__dirname,"/index.html"))
// })



// app.listen(3000,()=>{
//     console.log("Server Started...")
// })

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./routes/productRouter');
const cors = require('cors');

const app = express();
app.use(express.json());

// Enable CORS before routes
app.use(cors({
    origin: '*',  // Allows all domains
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  
    allowedHeaders: ['Content-Type']
}));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("ERROR: MONGO_URI is not defined. Check your .env file.");
    process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

app.use('/products', productRouter);

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}...`);
});
