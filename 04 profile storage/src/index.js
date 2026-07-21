import express from 'express'
import Redis from 'ioredis'

const app=express()

app.use(express.json());

const redis=new Redis("redis://localhost:6379")

// redis stores strings not js obj so convert intro json string before storing
// if want to change anything read whole string -> update -> store
app.post("/user/:id/json",async (req , res )=>{
    await redis.set(`user:${req.params.id}:json`,JSON.stringify(req.body));
    res.json({savedAs:"json"});
})


app.get("/user/:id/json",async (req , res )=>{
    const raw=await redis.get(`user:${req.params.id}:json`);
    res.json({user:raw ? JSON.parse(raw):null});
})


// store as object
// can update single field 
// await redis.hset("user:1:hash", "age", 22);

// stores in this way
// Key:
// user:1:hash

// Fields:
// name -> Nikhil
// age  -> 21
// city -> Dehradun
app.post("/user/:id/hash",async (req,res)=>{
    await redis.hset(`user:${req.params.id}:hash`,req.body);
    res.json({savedAs:"hash"});
})

// hgetall returns whole object
app.get("/user/:id/hash",async (req,res)=>{
    const user=await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user});
})

app.listen(3000,()=>{
    console.log("server running at port :: 3000")
})