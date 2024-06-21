const express =require ('express')
const placementApp=express.Router()

placementApp.get('/test-coordinator',(req,res)=>{
    res.send("from coordinator")
})

module.exports=placementApp