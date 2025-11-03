const mongoose = require('mongoose');
const User = require('../models/User');



const createuser = async (req, res) => {
    try {
        // Ensure DB is connected before attempting writes
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected (readyState=', mongoose.connection.readyState, ')');
            return res.status(503).json({ message: 'Service unavailable: database not connected' });
        }
        // Protect against undefined req.body
        const { username, email, password } = req.body || {};

        // Basic validation
        if (!username || !email || !password) {
            console.error('Error creating user: missing required fields', { username, email, password });
            return res.status(400).json({ message: 'username, email and password are required' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error('Error creating user:', err);
        // For easier debugging expose the error message in non-production environments
        const payload = { message: 'Internal server error' };
        if (process.env.NODE_ENV !== 'production') payload.error = err.message;
        res.status(500).json(payload);
    }
};
const getusers = async(req,res) =>{
    try{
        const users = await User.find();

        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getuser = async(req,res) =>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        const userId = await User.findById(id);
        if (!userId) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(userId);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateuser = async(req,res) =>{
    try{
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected (readyState=', mongoose.connection.readyState, ')');
            return res.status(503).json({ message: 'Service unavailable: database not connected' });
        }
        const { username, email, password } = req.body || {};

        // If email is being changed, ensure it's not already used by another user
        if (email) {
            const existing = await User.findOne({ email });
            if (existing && existing._id.toString() !== userId) {
                return res.status(409).json({ message: 'Email is already in use by another account' });
            }
        }

        const updateFields = {};
        if (username !== undefined) updateFields.username = username;
        if (email !== undefined) updateFields.email = email;
        if (password !== undefined) updateFields.password = password;

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        // Duplicate key (unique index) error from MongoDB
        if (err && (err.code === 11000 || err.codeName === 'DuplicateKey')) {
            return res.status(409).json({ message: 'Duplicate value conflict', details: err.keyValue || null });
        }
        const payload = { message: 'Internal server error' };
        if (process.env.NODE_ENV !== 'production') payload.error = err.message;
        res.status(500).json(payload);
    }
}
const deleteuser = async(req,res) =>{
    try{
        const userId = req.params.id;
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected (readyState=', mongoose.connection.readyState, ')');
            return res.status(503).json({ message: 'Service unavailable: database not connected' });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        const payload = { message: 'Internal server error' };
        if (process.env.NODE_ENV !== 'production') payload.error = err.message;
        res.status(500).json(payload);
    }
}


module.exports = { createuser, getusers, getuser, updateuser, deleteuser };