import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, role } = req.body;
    console.log('Body :::', req.body, role)
    if (!name) {
      return res.send({ message: 'Name is Required' });
    }
    if (!email) {
      return res.send({ message: 'Email is Required' });
    }
    if (!password) {
      return res.send({ message: 'Password is Required' });
    }
    if (!phone) {
      return res.send({ message: 'Phone no is Required' });
    }
    if (!address) {
      return res.send({ message: 'Address is Required' });
    }
    if (!answer) {
      return res.send({ message: 'Answer is Required' });
    }


    const exisistingUser = await userModel.findOne({ email });
    if (exisistingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //Register user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      role
    }).save();

    res.status(201).send({
      success: true,
      message: 'User Registered Successfully',
      user,
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,

    });
  }


};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const [email, answer, newPassword] = req.body
    if (!email) {
      res.status(400).send({ message: 'Email is required' })
    }
    if (!answer) {
      res.status(400).send({ message: 'answer is required' })
    }
    if (!newPassword) {
      res.status(400).send({ message: 'New Password is required' })
    }
    //check
    const user = await userModel.findOne({ email, answer })
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset Successfully",
    });

  } catch (error) {
    console.log(error)
    res.send(500).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }

}


//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// Product Controller

export const productController = async (req, res) => {
  try {
    console.log('req.body 1111 ::::', req.body)
    const { name, price, image, description } = req.body.data;
    const product = await new productModel({
      name,
      price,
      image,
      description
    }).save();

    res.status(200).send({
      success: true,
      message: 'Product Added Successfully',
      product,
    })
  } catch (error) {
    console.log(error)
  }
}
export const getProductController = async (req, res) => {
  console.log('Inside :::')
  try {
    const products = await productModel.find({});
    console.log('product :::', products)

    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
  }
}

