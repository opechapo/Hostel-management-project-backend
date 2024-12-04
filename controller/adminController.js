const AdminModel = require("../models/AdminModel");
const generateToken = require("./../utils/index");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const register = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      //  res.status(400).json({error: "All fields are required" });
      //   console.log( fullname, email, password);
      //  res.status(201).json({fullname, email, password});
      res.status(400);
      throw new Error("All fields are required");
    } else if (password.length < 6) {
      res.status(400);
      throw new Error("Password should be at least 6 characters long");
    }
    //check if email admin already exists


    const adminExists = await AdminModel.findOne({ email });
    if (adminExists) {
     return res.status(400).json({msg: "Email already exists"})
    }

    //create a new admin in the database
    const admin = await AdminModel.create({ fullname, email, password });

    //Generate JWT token for the admin
    const token = generateToken(admin._id);

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // expires in 1 day });
      sameSite: "none",  
      secure: true,
    });

    //send a success response with the admin details and token

    if (admin) {
      const { _id, fullname, email, role } = admin;
      res.status(201).json({ _id, fullname, email, role });
    } else {
      res.status(400);
      throw new Error("Invalid data");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

//Admin login
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await AdminModel.findOne({ email });
    //Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    //Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //Generate JWT token for the admin
    const token = generateToken(admin._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // expires in 1 day });
      sameSite: "none",
      secure: true,
    });
    const { _id, fullname, role } = admin;

    res.status(201).json({ _id, fullname, email, role, token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const getAdmin = asyncHandler(async (req, res) => {
  try {
    const { adminId} = req.params;
    //Find an admin by id
    const admin = await AdminModel.findById(adminId);
    
    if (admin) {
      const {_id, fullname, email, role} = admin;
      res.status(200).json({_id, fullname, email, role });

    }else {
      res.status(404).json({ message: "Admin not found" });
    }
  }catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

//Get details of the admins
const getAdmins = asyncHandler(async (req, res) => {
  try{
  const admins = await AdminModel.find()
  .sort("-createdAt")
  .select("-password");

  if(!admins){
    return res.status(404).json({message: "No admins found"})
  }
  res.status(200).json(admins);
} catch (error){
  console.error(error);
  res.status(500).send("Internal Server Error");
}
})

const updateAdmin = asyncHandler(async(req, res) => {
  const adminId = req.params.adminId;
  const {role} = req.body;
  try{
   const admin = await AdminModel.findById(adminId)
   if(!admin){
     return res.status(404).json({message: "Admin not found"})
   }
   admin.role = role;
   await admin.save();
   res.status(200).json(admin);
  } catch (error){
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

//Delete admin

const deleteAdmin = asyncHandler(async (req, res) => {
  try{
    const {adminId} = req.params;
    const admin = await AdminModel.findById(adminId);
    if(!admin){
      return res.status(404).json({message: "Admin not found"})
    }
    await admin.deleteOne();
    res.status(200).json({message: "Admin deleted successfully"});
  }catch(error){
    console.error(error.message);
    res.status(500).json({errorMessage: error.message});
  }

})

//logout Admin
const adminLogout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "none",
    secure: true
  })

  res.status(200).json({ message: "Logged out successfully" });

})

module.exports = { register, login, getAdmin, getAdmins, updateAdmin, deleteAdmin,adminLogout };
