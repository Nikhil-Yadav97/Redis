# Redis Queue (Producer–Consumer)
## Working

```text
        Client
           │
           ▼
    Express API (Producer)
           │
     RPUSH Job to Queue
           │
           ▼
      Redis Queue
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
 Worker1 Worker2 Worker3
 (BLPOP) (BLPOP) (BLPOP)
    │
    ▼
 Process Job
```

## Flow

1. Client sends a request to the Express API.
2. API creates a job.
3. Producer pushes the job into the Redis Queue using `RPUSH`.
4. Workers continuously wait for jobs using `BLPOP`.
5. As soon as a job is available, **only one worker** receives it.
6. The worker processes the job and waits for the next one.

## Important Points

- **Producer:** Creates and adds jobs to the queue.
- **Queue:** Stores jobs until a worker picks them up.
- **Consumer (Worker):** Removes and processes jobs.
- **RPUSH:** Adds a job to the end of the queue.
- **BLPOP:** Waits until a job is available and removes it from the queue.
- A job is processed **only once**.
- Multiple workers can consume from the same queue for faster processing.
- Workers can run on different machines or servers.
- The API returns quickly because processing happens asynchronously.

## Example

```
Client → Create Order
        │
        ▼
Express API
        │
 RPUSH "Send Email"
        │
        ▼
Redis Queue
        │
        ▼
Worker picks job using BLPOP
        │
        ▼
Email Sent ✅
```

<img width="1112" height="570" alt="image" src="https://github.com/user-attachments/assets/d7bf2ad4-7510-4d58-9e21-d2b52b312a7a" />


# Redis List
## Working

```text
             LPUSH / RPUSH
                  │
                  ▼
        ┌──────────────────────┐
        │  Redis List (Queue)  │
        │──────────────────────│
        │ Item 1               │
        │ Item 2               │
        │ Item 3               │
        └──────────────────────┘
          ▲                ▲
          │                │
      LPOP / BLPOP     RPOP / BRPOP
```

## Flow

1. Add items using `LPUSH` or `RPUSH`.
2. Redis stores them in order.
3. Remove items using `LPOP` or `RPOP`.
4. `BLPOP` and `BRPOP` wait until an item is available.

## Important Commands

| Command | Description |
|---------|-------------|
| `LPUSH` | Add item to the beginning of the list |
| `RPUSH` | Add item to the end of the list |
| `LPOP` | Remove first item |
| `RPOP` | Remove last item |
| `BLPOP` | Wait and remove first item |
| `BRPOP` | Wait and remove last item |
| `LRANGE` | View items in the list |
| `LLEN` | Get the number of items |

## Example

```text
RPUSH jobs email
RPUSH jobs payment
RPUSH jobs order

Queue:
[email] -> [payment] -> [order]

BLPOP jobs

Queue:
[payment] -> [order]
```

## Use Cases

- Job Queue
- Task Scheduling
- Background Workers
- Notification Queue
- Order Processing
- 
<img width="830" height="478" alt="image" src="https://github.com/user-attachments/assets/2f7bab62-f11f-469b-a19b-d9377eac1a2b" />



# Redis Pub/Sub
## Working

```text
              PUBLISH
                 │
                 ▼
         ┌─────────────────┐
         │ Redis Channel   │
         │   (e.g. order)  │
         └─────────────────┘
            │          │
            ▼          ▼
     Subscriber A  Subscriber B
        (Active)      (Active)

     Subscriber C (Offline)
          ❌ Does NOT receive message
```

## Flow

1. Publisher sends a message to a Redis channel using `PUBLISH`.
2. Redis immediately forwards the message to **all active subscribers**.
3. Every subscriber listening to that channel receives the message.
4. If a subscriber is offline, it **misses the message**.
5. Redis **does not store** Pub/Sub messages.

## Important Commands

| Command | Description |
|---------|-------------|
| `SUBSCRIBE channel` | Listen to a channel |
| `PUBLISH channel message` | Send a message |
| `UNSUBSCRIBE channel` | Stop listening to a channel |
| `PSUBSCRIBE pattern` | Subscribe using a pattern |

## Important Points

- Publisher and subscribers are independent.
- One published message is delivered to **all active subscribers**.
- Offline subscribers do **not** receive old messages.
- Messages are **not persisted** in Redis.
- Best for real-time communication.

## Example

```text
Publisher:
PUBLISH order "Order #101 Created"

Subscribers:
A ✅ Receives message
B ✅ Receives message
C ❌ Offline (does not receive it)
```

## Use Cases

- Live Chat
- Notifications
- Real-Time Dashboards
- Multiplayer Games
- Live Stock Price Updates
- Event Broadcasting
<img width="1062" height="555" alt="image" src="https://github.com/user-attachments/assets/3364e8a1-5d6d-4bc6-aaa2-00b1f008545d" />
