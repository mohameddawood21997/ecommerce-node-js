const db = require("../utlis/db");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {checkToken} = require("../token/tokenValidation")



//register
function createUser(user) {
  var salt = bcryptjs.genSaltSync(10);
  var hashedPassword = bcryptjs.hashSync(user.password, salt);
  return db.execute("INSERT INTO users (username,email, password) VALUES (?,?,?)", [
    user.username,
    user.email,
    hashedPassword,
  ]);
}


function getUserByEmail(email){
  return db.execute("SELECT * FROM users WHERE email = ?", [email]);
}

//get all products
function getAllproducts() {
  return db.execute("SELECT * FROM products ");
}

//getproductsByName serch by product name for  user
function getproductsByName(name) {
  return db.execute("SELECT * FROM products WHERE name=? ", [name]);
}

function getDataByName(name){
  return db.execute("SELECT * FROM products WHERE name LIKE ?", ["%"+name+"%"]);
}
//getproductsBySellerName serch by seller name for  user
function getproductsBySellerName(name) {
  return db.execute(
    "SELECT * FROM products p INNER JOIN seller S ON p.seller_id=s.id WHERE s.name=?",
    [name]
  );
}

//delete User
function deleteUser(id) {
  return db.execute("DELETE FROM users WHERE id = ?", [id]);
}

//update user
function updateUser(id, user) {
  var salt = bcryptjs.genSaltSync(10);
  var hashedPassword = bcryptjs.hashSync(user.password, salt);
  return db.execute(
    "UPDATE users SET username = ?, password = ? WHERE id = ?",
    [user.username, hashedPassword, id]
  );
}

//Get a user by username
function getUserById(id) {
    return db.execute('SELECT * FROM users WHERE id = ?', [id]);
  }

  function getOrdersByUserId(userId) {
    return db.execute("SELECT u.username,u.email,p.name,p.description,o.created_at FROM orders o INNER JOIN `order-products` op ON o.id=op.order_id  INNER JOIN products p ON op.product_id = p.id  INNER JOIN users u ON o.user_id=u.id  WHERE o.user_id =1 ", [userId]);
  }









  /////////////////////////////////////////////////

  const mysql = require('mysql2');

  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_project',
    password: '',
  });
  
  function executeQuery(query, values) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        connection.query(query, values, (error, results, fields) => {
          connection.release();
          if (error) {
            reject(error);
            return;
          }
          resolve(results);
        });
      });
    });
  }
  
  function createOrderWithProducts(req, res, next) {
    const { user_id,products} = req.body;
    const orderQuery = 'INSERT INTO orders (user_id) VALUES (?)';
    const orderValues = [user_id];
    // const productQuery = 'INSERT INTO order-products (order_id, product_id) VALUES ( ?, ?)';
    const productQuery = `INSERT INTO \`order-products\` (order_id, product_id) VALUES ?`;

  
    pool.getConnection((err, connection) => {
      if (err) {
        next(err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
          });
          next(err);
          return;
        }
        executeQuery(orderQuery, orderValues)
          .then(orderResult => {
            const orderId = orderResult.insertId;
            // const productValues = products.map(product => [orderId,product.product_id]);
            const productValues = products.map((product) => [orderId, product.product_id]);

            return executeQuery(productQuery, [productValues]);
          })
          .then(() => {
            connection.commit((err) => {
              if (err) {
                connection.rollback(() => {
                  connection.release();
                });
                next(err);
                return;
              }
              connection.release();
              res.status(201).json({ message: 'Order and order products created' });
            });
          })
          .catch(error => {
            connection.rollback(() => {
              connection.release();
            });
            next(error);
          });
      });
    });
  }
  
  //////////////////////////////////////////////////////









//////////////////////////make order///////////////////

module.exports = {
  getAllproducts,
  getproductsByName,
  getproductsBySellerName,
  updateUser,
  deleteUser,
  createUser,
  getUserById,
  getUserByEmail,
  getDataByName,
  createOrderWithProducts,
  getOrdersByUserId
};
