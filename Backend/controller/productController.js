const Product = require("../models/Product")
const Category = require("../models/Category")
const mongoose = require("mongoose")
const cloudinary = require("../utils/cloudinary")
const { productUpload } = require("../middleware/multer")

// Helper function to delete images from Cloudinary
const deleteCloudinaryImages = async (imageUrls) => {
  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    const deletePromises = imageUrls.map(async (imageUrl) => {
      try {
        const publicId = extractPublicIdFromUrl(imageUrl)
        if (publicId) {
          console.log("🗑️ Deleting image from Cloudinary:", publicId)
          const result = await cloudinary.uploader.destroy(publicId)
          console.log("✅ Image deleted:", result)
          return result
        }
      } catch (error) {
        console.error("❌ Error deleting image:", error)
        return null
      }
    })

    await Promise.all(deletePromises)
  }
}

// Extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    if (!url || typeof url !== "string") return null

    const urlParts = url.split("/")
    const uploadIndex = urlParts.findIndex((part) => part === "upload")

    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/")
      const publicId = pathAfterVersion.replace(/\.[^/.]+$/, "")
      return publicId
    }

    return null
  } catch (error) {
    console.error("Error extracting public_id:", error)
    return null
  }
}

// Convert string to boolean
const stringToBoolean = (value) => {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1"
  }
  return false
}

// Get all products with pagination and filtering
const getAllProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const filter = {}

    // Category filter
    if (req.query.category && req.query.category !== "null") {
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        filter.category = new mongoose.Types.ObjectId(req.query.category)
      }
    }

    if (req.query.size) {
      filter.sizes = { $in: [req.query.size] }
    }

    if (req.query.color) {
      filter.colors = { $in: [req.query.color] }
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {}
      if (req.query.minPrice) filter.price.$gte = Number.parseFloat(req.query.minPrice)
      if (req.query.maxPrice) filter.price.$lte = Number.parseFloat(req.query.maxPrice)
    }

    if (req.query.search) {
      filter.product_name = { $regex: req.query.search, $options: "i" }
    }

    if (req.query.featured === "true") {
      filter.featured = true
    }

    if (req.query.bestseller === "true") {
      filter.bestseller = true
    }

    console.log("Product filter applied:", filter)

    const count = await Product.countDocuments(filter)

    let sortOptions = { createdAt: -1 }
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1
      if (sortBy === "name") {
        sortOptions = { product_name: sortOrder }
      } else if (sortBy === "price") {
        sortOptions = { price: sortOrder }
      } else if (sortBy === "createdAt") {
        sortOptions = { createdAt: sortOrder }
      }
    }

    const products = await Product.find(filter)
      .populate("category", "category_name")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)

    const pages_count = Math.ceil(count / limit)

    res.status(200).json({
      success: true,
      count,
      pages_count,
      current_page: page,
      limit,
      data: products,
      rows: products,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const product = await Product.findById(req.params.id).populate("category", "category_name")

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.status(200).json({ success: true, data: product })
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Create product
const createProduct = async (req, res) => {
  try {
    console.log("\n🆕 Creating new product...")
    console.log("📝 Request body:", req.body)
    console.log("📁 Files received:", req.files)

    const {
      product_name,
      product_description,
      price,
      discount_price,
      category,
      sizes,
      colors,
      stock,
      featured,
      bestseller,
    } = req.body

    if (!product_name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: product_name, price, category",
      })
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" })
    }

    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Category not found" })
    }

    const images = []
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ success: false, message: "Maximum 3 images allowed" })
      }
      req.files.forEach((file) => images.push(file.path))
    }

    let parsedSizes = []
    if (sizes) {
      parsedSizes = Array.isArray(sizes)
        ? sizes.filter((size) => size && size.trim() !== "")
        : sizes.split(",").map((s) => s.trim()).filter((s) => s !== "")
    }

    let parsedColors = []
    if (colors) {
      parsedColors = Array.isArray(colors)
        ? colors.filter((c) => c && c.trim() !== "")
        : colors.split(",").map((c) => c.trim()).filter((c) => c !== "")
    }

    const product = new Product({
      product_name,
      product_description: product_description || "",
      price: Number.parseFloat(price),
      discount_price: discount_price ? Number.parseFloat(discount_price) : Number.parseFloat(price),
      category,
      images,
      sizes: parsedSizes,
      colors: parsedColors,
      stock: Number.parseInt(stock) || 0,
      featured: stringToBoolean(featured),
      bestseller: stringToBoolean(bestseller),
    })

    await product.save()
    const populatedProduct = await Product.findById(product._id).populate("category", "category_name")

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: populatedProduct,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const {
      product_name,
      product_description,
      price,
      discount_price,
      category,
      sizes,
      colors,
      stock,
      featured,
      bestseller,
      remove_images,
      replace_all_images,
    } = req.body

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" })
    }
    if (category) {
      const categoryExists = await Category.findById(category)
      if (!categoryExists) return res.status(400).json({ success: false, message: "Category not found" })
    }

    let updatedImages = [...product.images]

    if (replace_all_images === "true" || replace_all_images === true) {
      await deleteCloudinaryImages(product.images)
      updatedImages = []
      if (req.files && req.files.length > 0) {
        if (req.files.length > 3) {
          return res.status(400).json({ success: false, message: "Maximum 3 images allowed" })
        }
        req.files.forEach((file) => updatedImages.push(file.path))
      }
    } else {
      if (remove_images) {
        const imagesToRemove = typeof remove_images === "string" ? [remove_images] : remove_images
        const imagesToKeep = updatedImages.filter((img) => !imagesToRemove.includes(img))
        const actualImagesToRemove = updatedImages.filter((img) => imagesToRemove.includes(img))
        await deleteCloudinaryImages(actualImagesToRemove)
        updatedImages = imagesToKeep
      }
      if (req.files && req.files.length > 0) {
        const totalImages = updatedImages.length + req.files.length
        if (totalImages > 3) {
          return res.status(400).json({
            success: false,
            message: `Cannot add ${req.files.length} images. Maximum 3 allowed. Current: ${updatedImages.length}`,
          })
        }
        req.files.forEach((file) => updatedImages.push(file.path))
      }
    }

    let parsedSizes = product.sizes
    if (sizes !== undefined) {
      parsedSizes = Array.isArray(sizes)
        ? sizes.filter((s) => s && s.trim() !== "")
        : typeof sizes === "string"
        ? sizes.split(",").map((s) => s.trim()).filter((s) => s !== "")
        : []
    }

    let parsedColors = product.colors
    if (colors !== undefined) {
      parsedColors = Array.isArray(colors)
        ? colors.filter((c) => c && c.trim() !== "")
        : typeof colors === "string"
        ? colors.split(",").map((c) => c.trim()).filter((c) => c !== "")
        : []
    }

    const updateData = {
      product_name: product_name || product.product_name,
      product_description: product_description !== undefined ? product_description : product.product_description,
      price: price ? Number.parseFloat(price) : product.price,
      discount_price: discount_price ? Number.parseFloat(discount_price) : product.discount_price,
      category: category || product.category,
      images: updatedImages,
      sizes: parsedSizes,
      colors: parsedColors,
      stock: stock !== undefined ? Number.parseInt(stock) : product.stock,
      featured: featured !== undefined ? stringToBoolean(featured) : product.featured,
      bestseller: bestseller !== undefined ? stringToBoolean(bestseller) : product.bestseller,
      updatedAt: Date.now(),
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "category_name")

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })

    if (product.images && product.images.length > 0) {
      await deleteCloudinaryImages(product.images)
    }

    await Product.findByIdAndDelete(productId)
    res.status(200).json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Product filters
const getProductFilters = async (req, res) => {
  try {
    const sizes = await Product.distinct("sizes")
    const colors = await Product.distinct("colors")

    res.status(200).json({
      success: true,
      data: {
        sizes: sizes.filter((s) => s && s.trim() !== ""),
        colors: colors.filter((c) => c && c.trim() !== ""),
      },
    })
  } catch (error) {
    console.error("Error fetching product filters:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const count = await Product.countDocuments({ featured: true })
    const products = await Product.find({ featured: true })
      .populate("category", "category_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const pages_count = Math.ceil(count / limit)
    res.status(200).json({ success: true, count, pages_count, current_page: page, data: products, rows: products })
  } catch (error) {
    console.error("Error fetching featured products:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// Bestseller products
const getBestsellerProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const count = await Product.countDocuments({ bestseller: true })
    const products = await Product.find({ bestseller: true })
      .populate("category", "category_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const pages_count = Math.ceil(count / limit)
    res.status(200).json({ success: true, count, pages_count, current_page: page, data: products, rows: products })
  } catch (error) {
    console.error("Error fetching bestseller products:", error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

module.exports = {
  upload: productUpload,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductFilters,
  getFeaturedProducts,
  getBestsellerProducts,
}
