const db = require("../utlis/db");

//get all product
function getAllproducts() {
  return db.execute("SELECT * FROM products ");
}

module.exports = {
    getAllproducts,
 
};

