const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    interest: {
        type: [String],
        required: true
    },
    allowOffers: {
        type: Boolean,
        required: true
    },
    role: {
        type: String,
        default: 'user'}
});

module.exports = mongoose.model('user', userSchema);