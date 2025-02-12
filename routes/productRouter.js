//Local Array

// const express = require('express')
// const router = express.Router()
// const products = require('../products')
// const {myLogger} = require('../middleware/logger')

// //localhost:3000/products
// router.get('/',myLogger, (req, res) => {
//     // res.send("Inside Products")
//     try {
//         res.status(200).json(products)
//     } catch (error) {
//         res.status(404).json({ error: "Products not available!" })
//     }
// })

// //Get Product by id
// router.get('/:id', (req, res) => {
//     try {
//         const productID = parseInt(req.params.id)
//         const product = products.find(prod => prod.id == productID)
//         if (!product) {
//             res.status(404).json({ error: "Product not available!" })
//         }
//         res.status(200).json(product)

//     } catch (error) {
//         res.status(404).json({ error: error })

//     }
// })


// //Create product
// router.post('/', (req, res) => {
//     try {
//         if (!req.body) res.status(400).json({ message: "Name & Price are required!" })
//         const { name, price } = req.body
//         if(!name || !price) res.status(400).json({ message: "Name & Price are required!" })
            
//         const newProduct={
//             id:products.length?products[products.length-1].id+1:1,
//             name:name,
//             price:price
//         }
//         products.push(newProduct)
//         res.status(201).json({message:"Product has been added succesfully!",product:newProduct})
    
//     } catch (error) {
//         res.status(404).json({ error: error })


//     }
// })


// //Update a product

// router.patch('/:id',myLogger,(req,res)=>{
//     try {
//         const productID = parseInt(req.params.id)
//         const product = products.find(prod=>prod.id===productID)
//         if(!product){
//             res.status(404).json({error:"Product not available!"})

//         }
//         const {name,price} = req.body
//         product.price = price
//         product.name = name
//         res.status(200).json(product)

//     } catch (error) {
//         res.status(404).json({error:error})
        
//     }
// })

// //Delete product
// router.delete('/:id',(req,res)=>{
//     try {
//         const productID = parseInt(req.params.id)
//         const productIndex = products.findIndex(prod=>prod.id===productID)
//         if(productIndex == -1){
//             return res.status(404).json({error:"Product not found!"})
//         }
//         const deletedProduct = products.splice(productIndex,1)
//         res.status(200).json({message:"Product has been successfully deleted!",product:deletedProduct})        

//     } catch (error) {
//         res.status(404).json({error:error})
    
//     }
// })

// module.exports = router

//====================================================
//MongoDB
const express = require('express');
const Product = require('../models/productModel'); // Import MongoDB Model
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch from DB
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});
// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) }); 
        if (!product) {
            return res.status(404).json({ error: "Product not found!" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// CREATE new product
router.post('/', async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Name & Price are required!" });
        }

        
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const newId = lastProduct ? lastProduct.id + 1 : 1; 

        const newProduct = new Product({ id: newId, name, price });
        await newProduct.save();

        res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// UPDATE a product by ID
router.patch('/:id', async (req, res) => {
    try {
        const productID = parseInt(req.params.id); 
        const { name, price } = req.body;

        
        if (!name && !price) {
            return res.status(400).json({ error: "At least one field (name or price) is required!" });
        }

        
        const updatedProduct = await Product.findOneAndUpdate(
            { id: productID }, 
            { $set: { ...(name && { name }), ...(price && { price }) } }, 
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found!" });
        }

        res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// DELETE a product

router.delete('/:id', async (req, res) => {
    try {
        const productID = parseInt(req.params.id); // Convert to number

        // Find and delete the product using `id`
        const deletedProduct = await Product.findOneAndDelete({ id: productID });

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found!" });
        }

        res.status(200).json({ message: "Product deleted successfully!", product: deletedProduct });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;

