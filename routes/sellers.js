const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {checkToken} = require("../token/tokenValidation")
require("dotenv").config();

var {
  createSeller,
  getAllproducts,
  updateproductById,
  getproductsByName,
  createproduct,
  deleteproductById,
  // getproductsBySellerName,
  getDataBySeller,
  getSellerByEmail,
  getSellerById,
  deleteSeller,
  updateSeller,
  getProductById
} = require("../controllers/sellersControlers");

// Create a new seller
router.post("/", (req, res, next) => {
  createSeller(req.body)
    .then((result) => {
      res.status(201).json({ message: "seller created!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//login
router.post("/login", (req, res, next) => {

  const { email, password } = req.body;


  //Check if the user exists in the database
  getSellerByEmail(email).then(result => {
      if (result[0].length === 0){
          res.status(404).json({ message: 'User not found' });
      } else {
          const user = result[0][0];
          // console.log(user.password);
          const isPasswordMatch = bcryptjs.compareSync(password, user.password);
         
          if(isPasswordMatch){
              console.log(user);
              const payload = {email: user.email };
              console.log(payload);
              const token = jwt.sign(payload, 'secretkeyWMF', { expiresIn: '1h' });
              res.status(200).json({message: "Success login", token: token });
          } else {
              console.log('noooooo');
              res.status(401).json({ message: 'Invalid email or password' });
          }
      }
  })
  .catch(err => {
      res.status(500).json({ error: 'err' });
  });
});

// get seller by id -> view profile page
router.get("/profile/:id", checkToken, (req, res, next) => {
  var { id } = req.params;
  getSellerById(id).then(([rows]) => {
      res.status(200).json(rows);
  }).catch((err) => {
      res.status(500).json({ error: err  });
  });
});


// update seller by id -> edit profile info
router.put("/profile/:id", checkToken, (req, res, next)=>{
  var {id} = req.params;
  var user = req.body;
  updateSeller(id, user).then(([rows])=>{
      res.status(200).json({message: "Success Update"});
  }).catch((err)=>{
      res.status(422).json({massage: err.massage});
  });
});


// delete seller by id -> remove account
router.delete("/profile/:id", checkToken, (req, res, next)=>{
  var {id} = req.params;
  deleteSeller(id).then(([rows])=>{
      res.status(200).json({message: "Success Delete"});
  }).catch((err)=>{
      res.status(422).json({massage: err.massage});
  });
});





// get products by seller -> view products
router.get("/products/sellers/:seller", checkToken, (req, res, next)=>{
  var {seller} = req.params;
  console.log(seller);
  getDataBySeller(seller).then(([rows])=>{
      res.status(200).json(rows);
  }).catch((err)=>{
      res.status(500).json({massage: err.massage});
  });
});


// add new product -> create new product
router.post("/products", checkToken, (req, res, next)=>{
  var product = req.body;
  console.log(product);
  createproduct(product).then(([rows])=>{
      res.status(200).json({message: "Success Create New Product"});
  }).catch((err)=>{
      res.status(422).json({massage: err.massage});
  });
});


// // get products by id -> view product details
router.get("/product/:id", checkToken, (req, res, next)=>{
  var {id} = req.params;
  var {seller} = req.body;
  getProductById(id, seller).then(([rows])=>{
      res.status(200).json(rows);
  }).catch((err)=>{
      res.status(500).json({massage: err.massage});
  });
});


// // update product -> edit product
router.put("/product/:id", checkToken, (req, res, next)=>{
  var {id} = req.params;
  var product = req.body;
  updateproductById(id, product).then(([rows])=>{
      res.status(200).json({message: "Success Update Product"});
  }).catch((err)=>{
      res.status(422).json({massage: err.massage});
  });
});




// get all Products
//get all Products
router.get("/products", checkToken,(req, res, next) => {
  getAllproducts()
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//get Products by productName for seller
router.post("/getProductsbyName", (req, res, next) => {
  var { productname } = req.body;
  getproductsByName(productname)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//get products By Seller Name for seller
router.get("/search/products/:name",checkToken, (req, res, next) => {
  var { sellername } = req.params;
  console.log(sellername);
  getDataBySeller(sellername)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//delete product
router.delete("/product/:id",checkToken, (req, res, next) => {
  var productId = req.params.id;
  var { sellerID } = req.body;
  deleteproductById(productId, sellerID)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});






module.exports = router;
