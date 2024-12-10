const adminModel = require('./../models/AdminModel');
const generateToken = require('./../utils/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const register = asyncHandler(async(req, res) => {
    try {
        const {fullname, email, password} = req.body;
        if(!fullname || !email || !password) {
            res.status(400)
            throw new Error('All fields are required')
        } else if (password.length < 6)  {
            res.status(400);
            throw new Error('Minimum of six characters');
        } else if (password.length > 12) {
            res.status(400);
            throw new Error('Maximum of twelve characters');
        }

        // check if admin already exists
        
        const adminExists = await adminModel.findOne({ email })
        if(adminExists) {
            // console.log(error)
            return res.status(400).json({message: 'Email aleady exists'});
        }

        // create a new admin in the database
        const admin = await adminModel.create({fullname, email, password})

        // Generate JWT token for new admin
        const token = generateToken(admin._id);

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
            sameSite: 'none',
            secure: true
        })

        // Send a success response with admin details and token
        // console.log({admin})

        if(admin) {
            const { _id, fullname, email, role } = admin;
            res.status(201).json({_id, fullname, email, role})
        } else {
            res.status(400);
            throw new Error('Invalid Data')
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error!'})
        // console.log(error);
        // res.status(500).send('Internal Server Error!')
    }
})

// Admin Login

const login = asyncHandler( async (req, res) => {
    try {
        const {email, password} = req.body;
        let admin = await adminModel.findOne({email})

        // Check if the admin exists
        if(!admin) {
            return res.status(404).json({message: 'Admin Not Found!'})
        }
        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid Credentials'})
        }

        const token = generateToken(admin._id);
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
            sameSite: 'none',
            secure: true
        })

        const {_id, fullname, role} = admin;
        res.status(201).json({_id, fullname, email, role, token})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error!'})
    }
})

const getAdmin = asyncHandler(async(req, res) => {
    try {
        const {adminId} = req.params
        // Find an admin by id
        const admin = await adminModel.findById(adminId);
        // console.log(req.adminId)
        if(admin) {
            const {_id, fullname, email, role}  = admin
            res.status(200).json({_id, fullname, email, role})
        } else {
            res.status(404).json({message: 'Admin Not Found!'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error!' })
    }
})

// Get details of all admins

const getAdmins = asyncHandler(async(req, res) => {
    try {
        // const {adminId} = req.params
        // console.log(req.params)
        const admins = await adminModel.find().sort('-createdAt').select('-password');
    if(!admins) {
        return res.status(404).json({message: 'No admin found'})
    }
    res.status(200).json(admins);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error!'})
    }
})

const updateAdmin = asyncHandler(async(req, res) => {
    const {adminId} = req.params;
    const {role} = req.body;
    try {
        const admin = await adminModel.findById(adminId)
        if(!admin) {
            return res.status(404).json({message: 'admin not found'})
        }
        admin.role = role
        await admin.save()
        res.status(200).json(admin)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error!'})
    }
})

// Delete admin

const deleteAdmin = asyncHandler(async(req, res) => {
    try {
        const {adminId} = req.params;
        const admin = await adminModel.findById(adminId);
        if(!admin) {
            return res.status(404).json({message: 'admin not found'})
        }
        await admin.deleteOne()
        res.status(200).json({message: 'Admin deleted successfully!'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error!'})
    }
})

// Logout admin

const adminLogout = asyncHandler(async(req, res) => {
    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),  
        sameSite: 'none',
        secure: true
    })
    return res.status(200).json({message: 'Logout Successful'})
})

module.exports = {
    register,
    login,
    getAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    adminLogout
}