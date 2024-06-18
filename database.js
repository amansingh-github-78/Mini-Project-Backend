const mongoose = require('mongoose');
const mdburl = "mongodb://127.0.0.1:27017/siteforlocal"

const connectToMongo = async () => {
    try {
      await mongoose.connect(mdburl);
      console.log("Connected to mongoDB successfully");
    } catch (error) {
      console.log(error);
    }
  };
 
module.exports = connectToMongo