const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const Bcrypt = require("bcrypt");
const Order = require("../Models/Order");

//   Create Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Mothod for Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Method For Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.param.id);
    res.status(200).json("Order has Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Method For Get User Order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(201).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Method For Get All Orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  //param pass from postman,thunder Client

  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  // compare dates
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const PreviousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
            const incomeData = await Order.aggregate([{
                $match:{createdAt:{$gte:PreviousMonth}}},
                { $project:{
                month:{$month:"$createdAt"},
                sales:"$amount",
                }},
                {
                    $group:{
                        _id:"$month",
                        total:{$sum: "$sales"}
                    }
                }
            ])
            res.status(200).send(incomeData)
        } catch (error) {
    res.status(500).json(err);
  }
});

//   router.get("/status",verifyTokenAndAdmin,async(req,res)=>{
//           const date = new Date()
//           const lastYear =new Date(date.setFullYear(date.getFullYear()-1))

//           try{
//               const data = await User.aggregate([
//                   {$match:{createdAt:{$gte: lastYear}}},
//                   { $project:{
//                               month:{$month:"$createdAt"}
//                           },
//                       },
//                       {
//                           $group:{
//                               _id:"$month",
//                               total:{$sum:1 }
//                           }
//                       }
//               ])
//               res.status(201).json(data)
//           }catch(err){
//               res.status(500).json(err)
//           }
//   })

module.exports = router;


