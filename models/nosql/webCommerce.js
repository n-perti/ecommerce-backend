const { json } = require('express');
const mongoose = require('mongoose');

/* webCommerce scheme
City (String)
Activity (String)
Title (String)
Summary (text)
Text array (text)
Image array (url)
Users review:
    Scoring (number: 0 to 5)
    Total reviews (number)
    Review(text)
*/

const webCommerce = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    activity: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    text: {
        type: Array,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    usersReview: {
        scoring: {
            type: Number,
            required: false,
            default: 0
        },
        totalReviews: {
            type: Number,
            required: false,
            default: 0
        },
        review: {
            type: [
                {
                    review: String,
                    rating: Number,
                    date: { type: Date, default: Date.now }
                }
            ],
            required: false,
            default: []
        }
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    commerceCIF: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('webCommerce', webCommerce);
