const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes");

const corsOptions = {
  origin: ["*"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(router);

const port = 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

require("../models/index");
