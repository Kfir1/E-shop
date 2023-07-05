import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

// compare the entered password and the password of user from database (Authentication)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// pre() ensures the operation will run before saving to database
// use pre() to hash/encrypt the password before saving it to database
// 'save' - will do operation of hashing before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // if password is not isModified
        // next(), which means it will skip the password hashing process and move to the next middleware in the stack
        next(); 
    }

    const salt = await bcrypt.genSalt(10);
    // 'this' means the current user that is being saved
    // line below transforms the password received from user variable in userController to hashed password
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;