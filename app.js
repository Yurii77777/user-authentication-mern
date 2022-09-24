const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json({ extended: true }));
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const PORT = config.get("port") || 5000;

const start = async () => {
    try {
        await mongoose.connect(config.get("mongoUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () =>
            console.log(`App has been started on port ${PORT} `)
        );
    } catch (error) {
        console.log("Server error", error.message);
        process.exit(1);
    }
};

start();
