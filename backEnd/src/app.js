const express = require("express")
const cors = require("cors");
const cookieParser = require('cookie-parser');



const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

const combinedRoutes = require("../src/routes/combinedRoutes");
app.use("/api",combinedRoutes);

module.exports  = app;