// consumer

import {Worker} from "bullmq";
import {orderQueue} from "./queue.js";
import {connection} from "./queue.js";

// queue name, job processor function, connection
const worker = new Worker("order-Queue", 
async (job) => {
  console.log("Processing job:",job.name, job.id, job.data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Job completed:", job.name, job.id);
}, 
{ connection });


worker.on("completed", (job) => {
    console.log(`Job ${job.id} has been completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} has failed with error: ${err.message}`);
})