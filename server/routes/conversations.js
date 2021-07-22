const express = require('express')
const router = express.Router();
const Conversations = require("../models/conversations");
const messages = require('../models/messages');
const loginMiddleware = require("../middleware/loginMiddleware.js");


router.post("/conversations", loginMiddleware, async (req, res) => {
    try {
    const newConversations = new Conversations({
        userOne: req.user._id,
        userTwo: req.body.userTwo,
    })
        const saveConversations = await newConversations.save();
        res.status(200).json(saveConversations)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/conversations", loginMiddleware, async (req, res) => {
    try {
        console.log(req.user._id)
        const conversations = await Conversations.find({
            userOne: req.user._id,
        })
        .populate('userOne')
        .populate('userTwo')
        .populate('messages')
        res.status(200).json(conversations)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router; 