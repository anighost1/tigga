import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import hash from "../lib/hash.js";


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
        set: v => v.toLowerCase(),
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password must not exceed 128 characters'],
        validate: {
            validator: function (v) {
                // Ensure password contains at least one uppercase letter, one lowercase letter, one digit, and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: props => `${props.value} is not a valid password! Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
        },
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: v => v.toLocaleDateString(),
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        get: v => v.toLocaleDateString(),
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hash(this.password);
    }
    next();
});

userSchema.statics.signup = async function (name, username, email, password, role = 'user') {
    // Check if the email or username already exists
    const existingUser = await this.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new Error('Email or username already in use');
    }

    // Create a new user
    const user = new this({
        name,
        username,
        email,
        password: password,
        role
    });

    // Save the new user to the database
    await user.save();

    delete user.password

    // Return the newly created user
    return user;
};


userSchema.statics.login = async function (identifier, password) {
    // Find the user by email or username
    const user = await this.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
        throw new Error('No user found with this email or username');
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    // Generate a JWT token
    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        // eslint-disable-next-line no-undef
    }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });

    // Return the user object and token
    return token;
};


const User = mongoose.model('User', userSchema)

export default User