import AccessoryModel from "../models/accessoryModel.js";
import fs from 'fs';

// POST API to add a new product
const addAccessory = async (req, res) => {
  const { name, category, reviews, reviewCount, oldPrice, newPrice, currency, description, material, compatibility } = req.body;

  // Check for required fields
  if (!name || !category || !oldPrice || !newPrice || !currency || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = new AccessoryModel({
    name,
    category,
    reviews: parseFloat(reviews) || 0,
    reviewCount: parseInt(reviewCount) || 0,
    price: {
      oldPrice: parseFloat(oldPrice),
      newPrice: parseFloat(newPrice),
      currency
    },
    description,
    images: {
      mainImage: req.files['mainImage'] ? `/uploads/${req.files['mainImage'][0].filename}` : null,
      secondImage: req.files['secondImage'] ? `/uploads/${req.files['secondImage'][0].filename}` : null,
      thirdImage: req.files['thirdImage'] ? `/uploads/${req.files['thirdImage'][0].filename}` : null,
      fourthImage: req.files['fourthImage'] ? `/uploads/${req.files['fourthImage'][0].filename}` : null
    },
    additionalInfo: {
      material,
      compatibility: typeof compatibility === 'string' ? compatibility.split(',') : []
    }
  });

  try {
    const item = await newProduct.save();
    if (!item) {
      return res.status(500).send({
        success: false,
        message: "Database Problem"
      });
    }
    res.status(201).send({
      success: true,
      message: "Product Added Successfully",
      item
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error.message || "Product Adding Api Error"
    });
    console.error(error);
  }
};

export { addAccessory };
