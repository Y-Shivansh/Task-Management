import User from '../models/User.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { registerUserSchema, loginUserSchema, updatePasswordSchema } from '../schemas/userSchemas.js';

// Register new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        registerUserSchema.parse(req.body); // Validate request body

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({
            name,
            email,
            password,
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user
        await user.save();
        const token = generateToken(user.id)
        res.status(200).json({
            message: "Register Successful",
            token
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        loginUserSchema.parse(req.body); // Validate request body

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // generate token
        const token = generateToken(user.id)
        res.status(200).json({
            message: "Login Successful",
            token
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update user password
export const updatePassword = async (req, res) => {
    const { newPassword } = req.body;

    try {
        updatePasswordSchema.parse(req.body); // Validate request body

        // Find user by ID
        let user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Save the updated user
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};