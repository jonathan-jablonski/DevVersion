const express = require('express')
const router = express.Router();
const Conversations = require("../models/conversations");
const messages = require('../models/messages');


router.post("/conversations", async (req, res) => {
    const newConversations = new Conversations({
        userOne: req.body.userOne,
        userTwo: req.body.userTwo,
    })
    try {
        const saveConversations = await newConversations.save();
        res.status(200).json(saveConversations)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/conversations/:userId/", async (req, res) => {
    try {
        const conversations = await Messages.find({
            messages: req.body.text
        });
        console.log('this is res: ', conversations)
        res.status(200).json(conversations)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;