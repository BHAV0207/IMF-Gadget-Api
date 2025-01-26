require("dotenv").config();
const express = require("express");
const gadgetRoutes = require("./routes/gadgetRoutes");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use("/api", gadgetRoutes);

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
