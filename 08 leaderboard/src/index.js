import express from 'express'
import Redis from 'ioredis'

const app = express()

app.use(express.json());

const redis = new Redis("redis://localhost:6379")

// incrementing post views by 1 (incr)
app.post("/post/:id/view", async (req, res) => {
    const views = await redis.incr(`post:${req.params.id}:view`);
    res.json({
        post: req.params.id,
        views
    })
})

// adding score to leaderboard zincrby
app.post("/leaderboard/score", async (req, res) => {
    const { points, userid } = req.body;
    // ZINCRBY stores data in a Redis Sorted Set (ZSET).
    //     Key:
    // leaderboard

    // Member      Score
    // ------------------
    // nikhil      100
    const score = await redis.zincrby(
        "leaderboard",
        points,
        userid
    );
    res.json({
        userid,
        score,

    })
})

// getting top 10 players from leaderboard
app.get("/leaderboard", async (req, res) => {
//leaders format
//[
//     "bob", "250",
//     "alice", "180",
//     "nikhil", "150"
// ]
    const leaders = await redis.zrevrange(
        "leaderboard",
        0,
        9,
        "WITHSCORES"
    );

    const result = [];

    for (let i = 0; i < leaders.length; i += 2) {
        result.push({
            user: leaders[i],
            score: Number(leaders[i + 1])
        });
    }

    res.json(result);
});


app.get("/leaderboard/:userid/rank", async (req, res) => {

    const rank = await redis.zrevrank(
        "leaderboard",
        req.params.userid
    );

    if (rank === null) {
        return res.json({
            message: "User not found"
        });
    }

    res.json({
        user: req.params.userid,
        rank: rank + 1
    });
});

app.listen(3000, () => {
    console.log("server running at port :: 3000")
})