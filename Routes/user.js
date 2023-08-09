const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const Bcrypt = require("bcrypt");
const User = require("../Models/User");

// Mothod for Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //   const encPass = Bcrypt.hashSync(req.body.password, 12);
  //   if (req.body.password) {
  //     req.body.password = encPass;
  //   }
  try {
   
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
   
    res.status(500).json(err);
  }
});

//Method For Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.param.id);
    res.status(200).json("User has Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Method For Select  User By ID
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.param.id);

    const { decPass, ...others } = user._doc;

    res.status(201).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Method For Select All User
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  
   //param pass from postman 
    const query = req.query.new

    try {

    const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find();
    // const users =  await User.find();

    res.status(201).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/status",verifyTokenAndAdmin,async(req,res)=>{
        const date = new Date()
        const lastYear =new Date(date.setFullYear(date.getFullYear()-1))  

        try{
            const data = await User.aggregate([
                {$match:{createdAt:{$gte: lastYear}}},
                { $project:{    
                            month:{$month:"$createdAt"}
                        },
                    },
                    {
                        $group:{
                            _id:"$month",
                            total:{$sum:1 }
                        }
                    }
            ])
            res.status(201).json(data)
        }catch(err){
            res.status(500).json(err)
        }
})

module.exports = router;
