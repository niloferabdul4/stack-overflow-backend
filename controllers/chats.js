import mongoose from "mongoose";
import Chats from "../models/chat.js";

//email config


export const fetchAllMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chats.find({ userId });
    res.status(200).json(chats);
    //console.log(chats)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
