const express = require('express')
const router = express.Router();
const Convo = require("../models/convo")


router.post("/convo", async (req, res) => {
    const newConvo = new Convo({
        peers: [req.body.senderId, req.body.receiverId],
    })
    try{
        const saveConvo = await newConvo.save();
        res.status(200).json(saveConvo)
    }catch(err){
        res.status(500).json(err)
    }
})

router.get("/convo/:userId", async(req,res)=>{
    try{
        const convo = await Convo.find({
            peers: { $in:[req.params.userId]} ,
        });
        console.log('this is res: ', req.params.userId)
        res.status(200).json(convo)
    }catch (err){
        res.status(500).json(err);
    }
})

 module.exports = router;