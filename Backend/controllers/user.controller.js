import User from "../models/Users.js";

export const createUser = async (req, res) => {
  const { name} = req.body;

  const user = await User.create({
    name,
  });

  res.status(201).json(user);
};

export const getUsers = async (_, res) => {
  const users = await User.find();
  res.json(users);
};
