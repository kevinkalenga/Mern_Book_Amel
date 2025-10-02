import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/productModel.js";

// get all product (public)

// const getProducts = async(req, res) => {
    
    
    
//     try {
//         const pageSize = 10;
//         const page = Number(req.query.pageNumber) || 1;
//         const keyword = req.query.keyword ? {
//             name: {
//                 $regex: req.query.keyword,
//                 $options: 'i'
//             }
//         } : {};
//         const count = await Product.countDocuments(({...keyword}))
//          const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))
//          res.json({products, page, pages: Math.ceil(count / pageSize)})
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
  
    

    
  
// }


const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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




// create product review (private)
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

     // Vérifier si l'utilisateur a déjà fait un review
    const existingReview = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
    );

   

    if (existingReview) {
        // Mettre à jour le review existant
        existingReview.rating = Number(rating);
        existingReview.comment = comment;
        // ← mise à jour de la date
        existingReview.createdAt = new Date(); 
        await product.save();

        // Recalculer la note moyenne
        product.rating =
            product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length;

        await product.save();
        return res.status(200).json({ message: 'Review updated', product });
    }


     // Sinon, créer un nouveau review
    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Recalculer la note moyenne
    product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length;

    await product.save();
    
    const populatedProduct = await Product.findById(product._id)
    .populate("reviews.user", "name");

    // arrondir rating à 1 décimale pour chaque review
   populatedProduct.reviews = populatedProduct.reviews.map((rev) => ({
    ...rev.toObject(),
    rating: Math.round(Number(rev.rating) * 10) / 10
  }));

  populatedProduct.rating = Math.round(Number(populatedProduct.rating) * 10) / 10;
    
    
    res.status(201).json({
         success: true,
         product: populatedProduct,
         message: existingReview ? "Review updated" : "Review added"
     });
});







export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
}