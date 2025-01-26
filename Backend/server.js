require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const gadgetRoutes = require("./routes/gadgetRoutes");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", gadgetRoutes);

// Authenticate and sync database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
