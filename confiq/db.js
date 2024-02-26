const mongoose = require("mongoose");

function dbConnection() {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Alhamdulliah db connected!");
  });
}

module.exports = dbConnection;
