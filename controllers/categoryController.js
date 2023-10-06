import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import JWT from "jsonwebtoken";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(401).send({ message: "Name is required" })
    }
    const existingCategory = await categoryModel.findOne({ name })
    if (existingCategory) {
      res.status(200).send({
        success: true,
        message: "Category Already Exsists "
      })
    }
    const category = await categoryModel({ name, slug: slugify(name), }).save();
    res.status(201).send({
      success: true,
      category,
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in Category"
    })
  }

}