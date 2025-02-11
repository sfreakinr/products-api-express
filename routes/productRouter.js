const express = require('express')
const router = express.Router()
const products = require('../products')
const {myLogger} = require('../middleware/logger')

//localhost:3000/products
router.get('/',myLogger, (req, res) => {
    // res.send("Inside Products")
    try {
        res.status(200).json(products)
    } catch (error) {
        res.status(404).json({ error: "Products not available!" })
    }
})

//Get Product by id
router.get('/:id', (req, res) => {
    try {
        const productID = parseInt(req.params.id)
        const product = products.find(prod => prod.id == productID)
        if (!product) {
            res.status(404).json({ error: "Product not available!" })
        }
        res.status(200).json(product)

    } catch (error) {
        res.status(404).json({ error: error })

    }
})


//Create product
router.post('/', (req, res) => {
    try {
        if (!req.body) res.status(400).json({ message: "Name & Price are required!" })
        const { name, price } = req.body
        if(!name || !price) res.status(400).json({ message: "Name & Price are required!" })
            
        const newProduct={
            id:products.length?products[products.length-1].id+1:1,
            name:name,
            price:price
        }
        products.push(newProduct)
        res.status(201).json({message:"Product has been added succesfully!",product:newProduct})
    
    } catch (error) {
        res.status(404).json({ error: error })


    }
})


//Update a product

router.patch('/:id',myLogger,(req,res)=>{
    try {
        const productID = parseInt(req.params.id)
        const product = products.find(prod=>prod.id===productID)
        if(!product){
            res.status(404).json({error:"Product not available!"})

        }
        const {name,price} = req.body
        product.price = price
        product.name = name
        res.status(200).json(product)

    } catch (error) {
        res.status(404).json({error:error})
        
    }
})

//Delete product
router.delete('/:id',(req,res)=>{
    try {
        const productID = parseInt(req.params.id)
        const productIndex = products.findIndex(prod=>prod.id===productID)
        if(productIndex == -1){
            return res.status(404).json({error:"Product not found!"})
        }
        const deletedProduct = products.splice(productIndex,1)
        res.status(200).json({message:"Product has been successfully deleted!",product:deletedProduct})        

    } catch (error) {
        res.status(404).json({error:error})
    
    }
})

module.exports = router