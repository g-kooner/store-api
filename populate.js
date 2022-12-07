/*
To populate the db from scratch 
run node populate
*/

//access to env vars
require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // dels all enteries in database
    await Product.deleteMany();
    // populates db with data passed in from json products array of objs
    await Product.create(jsonProducts);
    console.log("SUCESS!!!");
    // end process after populate done
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
