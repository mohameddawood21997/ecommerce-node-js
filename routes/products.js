const express = require('express')
const router=express.Router()
var {getAllproducts} = require('../controllers/productsControllers')


//get all Products 
router.get("/",(req,res,next)=>{

    getAllproducts().then(([rows])=>{
        res.status(200).json(rows)
       }).catch((err)=>{
        res.status(500).json({message:err.message})
       })
})


module.exports= router







