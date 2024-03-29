const router = require("express").Router();
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer"); 

// add a new product
router.post("/add-product", authMiddleware, async (req, res) => {
    try {
        const {seller} = req.body;
        const sellerDetails = await User.findById(seller);
        const newProduct = new Product(req.body);
        await newProduct.save();

        // send notifications to admins
        const admins = await User.find({role : 'admin'});
        admins.forEach(async (admin) => {
            const newNotification = new Notification({
                user: admin._id,
                message: `New product added by ${sellerDetails.name}`,
                onClick: "/admin",
                title: "New Product",
                read: false,
            })
            await newNotification.save();
        })

        res.send({
            success:true,
            message:"Product Added Successfully",
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

// get all products
router.post("/get-products", authMiddleware, async (req, res) => {
    try {
        const {seller, category = [], age = [], status = "", name = ""} = req.body;
        let filters = {};
        if(seller){
            filters.seller = seller;
        }
        if(status){
            filters.status = status;
        }

        // filter by category
        if(category.length > 0){
            filters.category = {$in : category};
        }
        
        const products = await Product.find(filters).populate('seller').sort({createdAt:-1});

        const newProducts = [];

        if(age.length > 0 && name !== ""){
            age.forEach((item) => {
                const fromAge = Number(item.split('-')[0]);
                const toAge = Number(item.split('-')[1]);
                for(let i = 0; i < products.length; i++){
                    if(products[i].age >= fromAge && products[i].age <= toAge && products[i].name.toLowerCase().includes(name.toLowerCase())){
                        newProducts.push(products[i]);
                    }
                }
            });
            res.send({
                success:true,
                data:newProducts,
            })
        }else if(age.length > 0){
            age.forEach((item) => {
                const fromAge = Number(item.split('-')[0]);
                const toAge = Number(item.split('-')[1]);
                for(let i = 0; i < products.length; i++){
                    if(products[i].age >= fromAge && products[i].age <= toAge){
                        newProducts.push(products[i]);
                    }
                }
            });
            res.send({
                success:true,
                data:newProducts,
            })
        }else if(name !== ""){
            for(let i = 0; i < products.length; i++){
                if(products[i].name.toLowerCase().includes(name.toLowerCase())){
                    newProducts.push(products[i]);
                }
            }
            res.send({
                success:true,
                data:newProducts,
            })
        }else{
            res.send({
                success:true,
                data:products,
            });
        }
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});


// get a product by id
router.get("/get-product-by-id/:id", authMiddleware, async (req,res) =>{
   try {
     const product = await Product.findById(req.params.id).populate("seller");
     res.send({
        success:true,
        data:product,
     });
   }catch (error) {
     res.send({
        success:false,
        message:error.message,
     });
   }
});

// edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
    try {
        const {seller} = req.body;
        const sellerDetails = await User.findById(seller);
        await Product.findByIdAndUpdate(req.params.id, req.body);

        // send notifications to admins
        const admins = await User.find({role : 'admin'});
        admins.forEach(async (admin) => {
            const newNotification = new Notification({
                user: admin._id,
                message: `Product updated by ${sellerDetails.name}`,
                onClick: "/admin",
                title: "Updated Product",
                read: false,
            })
            await newNotification.save();
        });

        res.send({
            success:true,
            message:"Product Updated Successfully",
        })
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        })
    }
});

// delete a product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
   try {
     await Product.findByIdAndDelete(req.params.id);
     res.send({
        success:true,
        message:"Product Deleted Successfully",
     })
   } catch (error) {
     res.send({
        success:false,
        message:error.message,
     })
   }
});

// get image from pc
const storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname);
    }
});

router.post("/upload-image-to-product", authMiddleware, multer({storage : storage}).single("file"), async (req, res) => {
    try {
        // upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder:"sheymp",
        });

        const productId = req.body.productId;
        await Product.findByIdAndUpdate(productId, {
            $push: {images: result.secure_url},
        });
        res.send({
            success: true,
            message: "Image Uploaded Successfully",
            data: result.secure_url,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

// update product status
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
    try {
        const {status} = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {status});

        // send notification to seller
        const newNotification = new Notification({
            user : updatedProduct.seller,
            message : `Your product ${updatedProduct.name} has been ${status}`,
            title : "Product Status Updated",
            onClick : "/profile",
            read : false,
        });
        await newNotification.save();

        res.send({
            success: true,
            message: "Product Status Updated Successfully",
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

// get all products
// router.post("/get-products", async (req, res) => {
//     try {
//         const {seller, category = [], age = [], status} = req.body;
//         let filters = {};
//         if(seller){
//             filters.seller = seller;
//         }
//         if(status){
//             filters.status = status;
//         }

//         // filter by category
//         if(category.length > 0){
//             filters.category = {$in : category};
//         }


//         // filter by age
//         if(age.length > 0){
//             age.forEach((item) => {
//                 const fromAge = item.split('-')[0];
//                 const toAge = item.split('-')[1];
//                 filters.age ={$gte : fromAge, $lte : toAge};
//                 console.log(filters);
//             });
//         }

//         const products = await Product.find(filters).populate('seller').sort({createdAt:-1});
//         res.send({
//             success:true,
//             data:products,
//         });
//     } catch (error) {
//         res.send({
//             success:false,
//             message:error.message,
//         });
//     }
// });


module.exports = router;
