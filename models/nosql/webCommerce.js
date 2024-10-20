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
            required: true,
        },
        totalReviews: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            required: true,
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
