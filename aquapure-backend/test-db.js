const mongoose = require('mongoose');

// Constructed from the shard hostname found in logs
const directUri = "mongodb://shadanmd566_db_user:57UO9uqBiAZ0a8VL@ac-nvsqasf-shard-00-01.6hkuw4j.mongodb.net:27017/aquapure?ssl=true&authSource=admin&w=majority";

console.log("Testing DIRECT connection...");

mongoose.connect(directUri)
  .then(() => {
    console.log("Successfully connected to MongoDB (Direct Mode)!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
