const express = require("express");
const cors = require("cors");
require("dotenv").config();

const monitorRoutes = require("./routes/monitorRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Website Health Monitor API is running"
    });
});

app.use("/api", monitorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});