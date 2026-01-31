import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: function () { return !this.provider || this.provider === 'email'; }
    },
    provider: {
        type: String,
        default: 'email' // 'email' or 'google'
    },
    tryOnCount: {
        type: Number,
        default: 0
    },
    lastTryOnDate: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // Only hash if password exists (could be google auth user)
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
