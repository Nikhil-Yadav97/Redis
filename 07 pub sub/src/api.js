import express from 'express'
import Redis from 'ioredis'

const app=express()

app.use(express.json());

const publisher=new Redis("redis://localhost:6379")

app.post("/email",async (req,res)=>{
    const job={
        to:req.body.to,
        subject:req.body.subject,
        body:req.body.body,
        createdAt:new Date().toISOString()
    }
    await publisher.publish("emailQueue",JSON.stringify(job));
    res.json({message:"email job added to queue",job}   )
})




app.listen(3000,()=>{
    console.log("server running at port :: 3000")
})