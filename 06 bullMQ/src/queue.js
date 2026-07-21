import {Queue} from "bullmq";
 
export const connection={
    host:"localhost",
    port:6379
};

export const orderQueue=new Queue("order-Queue",{connection});