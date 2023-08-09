const router = require("express").Router();
const User = require("../Models/User");
const Bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {
  const encPass = Bcrypt.hashSync(req.body.password, 12);

  const newUser = new User({
    username: req.body.username,
    password: encPass,
    email: req.body.email,
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    address:req.body.address,
    tc:req.body.tc,
    pincode:req.body.pincode,
    phone:req.body.phone
  });
  try {
    const NewUser = await newUser.save();
    res.status(201).json(NewUser);
    console.log(NewUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  let password = req.body.password;
  try {
    const DBUser = await User.findOne({ email: req.body.email });

    if (!DBUser && res.status(401).json("Wrong Credentials"))
      decPass = Bcrypt.compareSync(password, DBUser.password);

    if (decPass !== password &&
      res.status(401).json("wrong credential") )
      console.log("wrong Pass") 

    const accessToken= jwt.sign({
        id:DBUser._id,
        usAdmin:DBUser.usAdmin
    },process.env.JWT_SEC,{expiresIn:"1d"})


    // const {decPass,...others} = DBUser   DBUser contain _doc object that  have perticuler Id wise Data so We Have To Access _doc  
      const {decPass,...others} = DBUser._doc

    res.status(201).json({...others,accessToken});
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
