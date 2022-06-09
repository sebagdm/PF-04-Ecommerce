const { orderModel, productModel, userModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

const { transporter, emailer } = require("../config/email");

const getItems = async (req, res) => {
  console.log('hola')
  try {
    const data = await orderModel.find().populate("products").populate("buyer");
    if (data.length) {
      return res.status(200).send({ data });
    }
  } catch (e) {
    console.log(e);
    handleHttpError(res, "ERROR_GET_ITEMS");
  }
};

const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await orderModel
      .findById(id)
      .populate("products")
      .populate("buyer");
    if (data) {
      res.status(200).send({ data });
    }
  } catch (e) {
    handleHttpError(res, "ERROR_GET_ITEM");
  }
};

const createItem = async (req, res) => {
  const {
    buyer,
    phone,
    products,
    shipping,
    payment,
    date,
    users,
    cost,
    quantity,
  } = req.body;
  console.log("products", products);
  try {
    const newOrder = new orderModel({
      phone,
      shipping,
      payment,
      date,
      cost,
      quantity,
    });

    newOrder.products = products;

    const foundUser = await userModel.findOne({ email: users.email });
    console.log(`Esto es ${foundUser}`);
    if (!foundUser) {
      const newUser = new userModel({
        name: users.name,
        email: users.email,
      });

      newOrder.buyer = newUser;
      transporter.sendMail(emailer(users));
      const savedUser = await newUser.save();
    } else {
      newOrder.buyer = foundUser;
    }

    if (newOrder) {
      const savedOrder = await newOrder.save();
      userOrder = await userModel.updateOne(
        { email: users.email },
        { $addToSet: { orders: [savedOrder] } }
      );
      userShipping = await userModel.updateOne(
        { email: users.email },
        { $addToSet: { shipping: savedOrder.shipping } }
      );
      console.log("este es el id de la orden " + savedOrder._id);
      return res.status(201).send(savedOrder);
    }
    return res.status(404).send("Error: the order has not been created.");
  } catch (e) {
    console.log(e);
    handleHttpError(res, "ERROR_CREATE_ITEMS");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const data = await orderModel.findByIdAndUpdate(id, body);
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_UPDATE_ITEMS");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResponse = await orderModel.findByIdAndRemove({ _id: id });
    const data = {
      deleted: deleteResponse.matchedCount,
    };

    res.send({ data });
  } catch (e) {
    console.log(e);
    handleHttpError(res, "ERROR_DELETE_ITEM");
  }
};

//relacionado a order
const purchaseEmail = async (req, res) => {
  const { idUser } = req.params;
  const data = req.body;
  try {
    const user = await userModel.findOne({ _id: idUser });
    if (data.status === "approved") {
      transporter.sendMail(emailOrder(user, data));
      res.send("El email se mando correctamente");
    }
  } catch (err) {
    console.log(err);
    handleHttpError(res, "ERROR_PURCHASE_EMAIL");
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  purchaseEmail,
};
