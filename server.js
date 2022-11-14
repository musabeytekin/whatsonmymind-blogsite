const express = require("express");
const dotenv = require("dotenv");
const {db} = require("./helpers/database/dbconnect");
const errorHandler = require("./middlewares/errors/errorHandler");
const routes = require("./routes");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require('cors');
const limitAccess = require("./middlewares/security/limitAccess");


// Environment Variables
dotenv.config({path : "./config/env/config.env"});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

db();

app.use(express.static("public"))

app.use(xss());
app.use(limitAccess({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 500    
}));
app.use(hpp());
app.use(cors());

app.use("/api", routes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`App started on port ${PORT}, env: ${process.env.NODE_ENV}`);
})




