//access to env vars
require("dotenv").config();
//async errors pckg
require("express-async-errors");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

//middleware
//uses global middleware first then if next is called falls to standard route func
//order of middleware use matters
//parse json requests incoming (not used in this proj)
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send('<h1>Store Api</h1> <a href="/api/v1/products">products</a>');
});

//setup router
app.use("/api/v1/products", productsRouter);

//products route
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    //connectDb
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening to port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
