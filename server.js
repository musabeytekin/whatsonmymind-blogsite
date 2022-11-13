const express = require("express");
const dotenv = require("dotenv");
const {db} = require("./helpers/database/dbconnect");
const errorHandler = require("./middlewares/errors/errorHandler");
const routes = require("./routes");

// Environment Variables
dotenv.config({path : "./config/env/config.env"});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

db();

app.use(express.static("public"))

app.use("/api", routes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`App started on port ${PORT}, env: ${process.env.NODE_ENV}`);
})




