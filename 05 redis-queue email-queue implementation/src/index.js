import express from 'express'
import Redis from 'ioredis'

const app=express()

app.use(express.json());

const redis=new Redis("redis://localhost:6379")


// drawbacks of redis not recovery system, if server goes down all data will be lost
// no parallel workers , job loss
app.post("/emails",async (req,res)=>{
    const job={
        to:req.body.to,
        subject:req.body.subject,
        body:req.body.body,
        createdAt:new Date().toISOString()
    }
    await redis.lpush("emailQueue",JSON.stringify(job));
    res.json({message:"email job added to queue",job}   )
})

app.get("/emails",async (req,res)=>{
    const job=await redis.rpop("emailQueue");
    res.json({job:job ? JSON.parse(job):null})
})

app.listen(3000,()=>{
    console.log("server running at port :: 3000")
})