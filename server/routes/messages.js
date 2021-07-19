const express = require('express')
const router = express.Router();
const Messages = require("../models/messages")

router.post("/", async (req, res) => {
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

router.get("/messages/:convoId", async (req, res) => {
    try{
        const messages = await Messages.find({
            convoId: req.params.convoId
        })
        res.status(200).json(messages)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;