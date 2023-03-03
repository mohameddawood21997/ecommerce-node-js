const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const {checkToken} = require("../token/tokenValidation")
 require('dotenv').config()
var {
  getproductsByName,
  getproductsBySellerName,
  getAllproducts,
  updateUser,
  deleteUser,
  getUserByEmail,
  createUser,
  getUserById,
  getDataByName,
  createOrderWithProducts,
  getOrdersByUserId
} = require("../controllers/usersControllers");

// Create a new user
router.post("/", (req, res, next) => {
  createUser(req.body)
    .then((result) => {
      res.status(201).json({ message: "User created!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// get user -> login
router.post("/login", (req, res, next) => {

  const { email, password } = req.body;


  //Check if the user exists in the database
  getUserByEmail(email).then(result => {
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

//get user By ID
router.get("/:id",checkToken, (req, res, next) => {
   var { id } = req.params;
  getUserById(id).then(([rows]) => {
    res.status(200).json(rows);
}).catch((err) => {
    res.status(500).json({ error: err  });
});
});

//get Products by productName for user
router.get("/getProductsbyName",checkToken,(req, res, next) => {
  const { productname1 } = req.body;
  // var { productname } = req.params;
  console.log(productname1);
  getproductsByName(productname1)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});


// get products by name -> search product by name
router.get("/search/products/:name",checkToken, (req, res, next) => {
  var { name } = req.params;
  getDataByName(name).then(([rows]) => {
      res.status(200).json(rows);
  }).catch((err) => {
      res.status(500).json({ massage: err.massage });
  });
});


//get products By Seller Name for user
router.get("/search/sellers/:seller",checkToken, (req, res, next) => {
  var { seller } = req.params;
  getproductsBySellerName(seller).then(([rows]) => {
      res.status(200).json(rows);
  }).catch((err) => {
      res.status(500).json({ massage: err.massage });
  });
});

//update user
router.patch("/:id", checkToken,(req, res, next) => {
  var userId = req.params.id;
  var user = req.body;
  updateUser(userId, user)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//delete user
router.delete("/:id", checkToken,(req, res, next) => {
  var userId = req.params.id;
  deleteUser(userId)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

/////////////////////////////////////////////
//get orders for user by Id
router.get("/orders/:id", (req, res, next) => {
  var userId = req.params;
  console.log(userId);
  getOrdersByUserId(userId).then(([rows]) => {
      res.status(200).json(rows);
  }).catch((err) => {
      res.status(500).json({ massage: err.massage });
  });
});

router.post('/logout', (req, res) => {
  const { token } = req.body;

  // remove the token from the user's session or database
  // for example, if you are using JWT tokens, you can add the token to a blacklist
  // to prevent it from being used in the future

  // set the token expiration time to a past date
  res.cookie('token', '', { expires: new Date(0) });

  res.json({ message: 'Logout successful' });
});





router.post('/orders', createOrderWithProducts);
/////////////////////////////make order for user////////////////////////////

module.exports = router;
