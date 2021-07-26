const express = require('express')
const router = express.Router();
const Messages = require("../models/messages")
const loginMiddleware = require("../middleware/loginMiddleware.js");

router.post("/messages", loginMiddleware, async (req, res) => {
    const newMessage = new Messages({
        sender: req.body.sender,
        text: req.body.text,
        date: req.body.date
    })
    try {
        const saveMessage = await newMessage.save();
        res.status(200).json(saveMessage)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/messages", loginMiddleware, async (req, res) => {
    try {
        const messages = await Messages.find({
            sender: req.user._id
        })
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;