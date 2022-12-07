const Product = require("../models/product");

// testing
const getAllProductsStatic = async (req, res) => {
  //test throwing errors which will be handled by cutome error handler
  //throw new Error('testing async errors)
  const products = await Product.find({
    featured: true,
    name: "vase table",
  });
  res.status(200).json({ products, nbHits: products.length });
};

// actual
const getAllProducts = async (req, res) => {
  // access to search params passed in thru req.query
  // console.log(req.query);

  // destructure and pull out only the properties that want to use in find
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    //pattern matching using regex and case insensitive
    queryObject.name = { $regex: name, $options: "i" };
  }

  //numeric filtering to get field above a certain value
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    //after regex match and replace it will look like price-$gt-40,rating-$gte-4
    //manipulate it more to get it into mongoose format
    //only numeric filter on these
    const options = ["price", "rating"];

    filters = filters.split(",").forEach((item) => {
      //destructure the different parts after the split
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        //put into mongoose format that allows find to work
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  //handle if the user is passing in sort or not
  //if so then chain it after the last find
  // await the final result after query results have been sorted
  // find returns a cursor / pointer to filtered collections methods
  let result = Product.find(queryObject);
  if (sort) {
    // create a list of spaced values for order to sort by
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    // only want to select specific fields of an object
    result = result.select(fieldsList);
  }

  // pagination
  // say limit set to 2 and page is 2 then it will skip first 2 items and start from second like u are on pg number 2
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
