const express = require("express");
const postRoutes = require('./routes/post.routes');
const cookieparser = require('cookie-parser');
const taskRoutes = require('./routes/task.routes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieparser());

app.use(
    cors({
        origin: (origin, callback) => {
            const allowList = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            if (!origin) return callback(null, true);
            if (allowList.includes(origin)) return callback(null, true);
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);





app.use("/api", postRoutes);
app.use("/api", taskRoutes);




module.exports= app;