import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/productModel.js";

// get all product (public)

const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

// get single product (public)
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        return res.json(product)
    } else {
        res.status(404);
        throw new Error("Produit non trouvé")
    }
})

// Create product (admin privé)

const createProduct = asyncHandler(async(req, res) => {
     const product = new Product({
        name:"Sample product",
        price: 0,
        user: req.user._id,
        image:"/images/sample.png",
        category: "Produit category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description"
     })

     const createdProduct = await product.save()
     res.status(201).json(createdProduct)
})

// update product (admin private)
const updateProduct = asyncHandler(async(req, res) => {
    const {name, price, description, image, category, countInStock} = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name; 
        product.price = price;
        product.description = description;
        product.image = image;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error("Produit non trouvé")
    }
})

// delete product (admin private)

const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product) {
        await Product.deleteOne({_id: product._id})
        res.status(200).json({message: 'Produit supprimé'})
    } else {
        res.status(404)
        throw new Error("Produit non trouvé")
    }
})

// create product review

const createProductReview = asyncHandler(async(req, res) => {
    const {rating, comment} = req.body 
    const product = await Product.findById(req.params.id)

    if(product) {
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        )
        if(alreadyReviewed) {
             res.status(404)
             throw new Error("Produit deja evalué")
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length 
         
        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0)

        product.reviews.length;

        await product.save();

        res.status(201).json({message: "L'ajout d'une evaluation reussi"})

    } else {
        res.status(404)
        throw new Error("Produit non trouvé")
    }
})







export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
}