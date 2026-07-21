import express from "express";

import { orderQueue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/orders", async (req, res) => {
    const job = await orderQueue.add("order", req.body,{
        attempts: 3, // Number of attempts to process the job
        backoff: {
            type: "exponential", // Backoff strategy (exponential backoff)
            delay: 1000, // Initial delay in milliseconds
        },
    });
    res.json({ message: "order added to queue", job });
});

app.listen
    (3000, () => {
        console.log("server running at port :: 3000");
    })