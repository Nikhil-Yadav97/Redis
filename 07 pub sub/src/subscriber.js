import Redis from "ioredis"

const subscriber=new Redis("redis://localhost:6379")

subscriber.subscribe("emailQueue",(err)=>{
    if(err){
        console.log("error subscribing to emailQueue channel",err)  
        return ;
    }
    console.log("subscribed to emailQueue channel")
});


subscriber.on("message",(channel,message)=>{
    console.log("message received from channel",channel,message)
    const job=JSON.parse(message);
    console.log("job received",job)
})