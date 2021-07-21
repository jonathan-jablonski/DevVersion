const express = require('express')
const router = express.Router();
const Messages = require("../models/messages")

router.post("/messages", async (req, res) => {
    const newMessage = new Messages({
        text: req.body.text
    })
    try{
        const saveMessage = await newMessage.save();
        res.status(200).json(saveMessage)
    }catch(err){
        res.status(500).json(err)
    }
})

router.get("/messages/:messageId", async (req, res) => {
    try{
        const messages = await Messages.find({
            _id: req.params.id
        })
        res.status(200).json(messages)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;