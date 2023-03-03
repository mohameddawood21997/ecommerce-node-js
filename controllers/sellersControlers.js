const db = require("../utlis/db");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');

//register
function createSeller(seller) {
    var salt = bcryptjs.genSaltSync(10);
    var hashedPassword = bcryptjs.hashSync(seller.password, salt);
    return db.execute("INSERT INTO seller (name ,email,password) VALUES (?,?, ?)", [
        seller.name,
        seller.email,
      hashedPassword
    ]);
  }
  
  
  //login
  const loginSeller = async (email, password) => {
    const [rows] = await db.execute(
      "SELECT id, email, password FROM seller WHERE email = ?",
      [email]
    );
    const seller = rows[0];
  
    if (!seller) {
      throw new Error("Invalid email or password");
    }
  
    const isPasswordValid = await bcryptjs.compare(password, seller.password);
  
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
  
    const token = jwt.sign({ id: seller.id }, process.env.JWT_KEY);
  
    return { token };
  };
  
//get all products
function getAllproducts() {
  return db.execute("SELECT * FROM products ");
}

//getproductsByName serch by name for  seller
function getproductsByName(name) {
  return db.execute("SELECT * FROM products WHERE name=? ", [name]);
}

//getproductsBySellerName serch by name for  seller
function getDataBySeller(name) {
  return db.execute(
    "SELECT * FROM products p INNER JOIN seller S on p.seller_id=s.id WHERE s.name=? ",
    [name]
  );
}

//getAllproducts sea all products for a spasific sellers
function getAllproductsForSeller(sellerId) {
  return db.execute(
    "SELECT * FROM products p INNER JOIN sellers S on p.seller_id=? ",
    [sellerId]
  );
}

//updateproductById  edit a product by id for sellers
function updateproductById(productId, product) {
  return db.execute(
    "UPDATE products SET name=? , description=?, image=? WHERE id=? &&  seller_id=? ",
    [
      product.name,
      product.description,
      product.image,
      productId,
      product.seller_id,
    ]
  );
}

//deleteproductById delete a product by id for sellers
function deleteproductById(productId, sellerId) {
  return db.execute("DELETE FROM products WHERE id=?  &&  seller_id=? ", [
    productId,
    sellerId,
  ]);
}
//deleteSeller
function deleteSeller(sellerId) {
  return db.execute("DELETE FROM seller WHERE id=?  ", [sellerId]);
}
//update Seller
function updateSeller(id, seller) {
  var salt = bcryptjs.genSaltSync(10);
  var hashedPassword = bcryptjs.hashSync(seller.password, salt);
  return db.execute(
    "UPDATE seller SET name = ?, password = ? WHERE id = ?",
    [seller.name, hashedPassword, id]
  );
}



//create product a product for sellers
function createproduct(product) {
  return db.execute(
    "INSERT into products  ( name, image,description, seller_id) VALUES (?,?,?,?) ",
    [product.name, product.description, product.image, product.seller_id]
  );
}

function getSellerByEmail(email) {
    return db.execute('SELECT * FROM seller WHERE email = ?', [email]);
  }

  function getSellerById(email) {
    return db.execute('SELECT * FROM seller WHERE id = ?', [email]);
  }

  function getProductById(email) {
    return db.execute('SELECT * FROM seller WHERE id = ?', [email]);
  }




module.exports = {
  getAllproducts,
  updateproductById,
  getproductsByName,
  createproduct,
  deleteproductById,
  // getproductsBySellerName,
  getDataBySeller,
  getAllproductsForSeller,
  createSeller,
  loginSeller,
  getSellerByEmail,
  getSellerById,
  deleteSeller,
  updateSeller,
  getProductById
};
