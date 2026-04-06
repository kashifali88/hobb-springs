import Products from '../models/product.model.js';
import slugify from 'slugify';
import { errorHandler } from '../utils/errorHandler.js';

export const createProduct = async (req, res, next) => {
    try {
        const {name, slug, description, price, category,productImage, quantity, shipping} = req.body;
        switch (true) {
            case !name:
                return next(errorHandler(500, 'Name is required')) 
            case !description:
                return next(errorHandler(500, 'Description is required')) 
            case !price:
                return next(errorHandler(500, 'Price is required')) 
            case !category:
                return next(errorHandler(500, 'Category is required')) 
            case !quantity:
                return next(errorHandler(500, 'Quantity is required')) 
            case !productImage && productImage.size > 10000:
                return next(errorHandler(402, 'product image  is required and size must lower than 1mb')) 
        }
        const products = new Products({name, description,price,category,productImage,quantity,shipping, slug:slugify(name)});

        await products.save();
        res.status(201).json({success:true, message:'Product created successfully', products})
    } catch (error) {
        next(error)
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 15;
        const page = Number(req.query.page) || 1;
        const skip = (page -1 ) * limit
        const products = await Products.find({}).limit(limit).skip(skip).sort({createdAt:-1});
        const totalProducts = await Products.countDocuments()
        res.status(200).json({success:true, products, totalProducts})
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const product = await Products.findOne({slug}).populate("category")
        res.status(200).json({success:true, product})
    } catch (error) {
        next(error)
    }
}
// get product by query
export const filterProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let filter = {};

      if (category) {
      // multiple categories can be comma-separated
      const categories = category.split(','); 
      filter.category = { $in: categories }; 
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
      if (search) {
      // search by name 
      filter.name = { $regex: new RegExp(search, "i") };
    }


    const products = await Products.find(filter).populate('category').sort({ createdAt: -1 });
    const totalProducts = products.length;

    res.status(200).json({
      success: true,
      products,
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params; // get slug from URL
    const product = await Products.findOne({ slug });
    if (!product) {
      return next(errorHandler(404, "No product found"));
    }

    const updatedData = {
      ...req.body,
      slug: req.body.name ? slugify(req.body.name) : product.slug,
    };

    const updatedProduct = await Products.findOneAndUpdate(
      { slug },
      { $set: updatedData },
      { new: true } 
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Products.findById(id);
        if (!product) {
            return next(errorHandler(404, 'No product found'))
        }
        await Products.findByIdAndDelete(id)
        res.status(200).json({success:true, message: 'product deleted successfully'})
    } catch (error) {
        next(error)
    }
}



