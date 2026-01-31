const mongoose = require('mongoose');

const tryOnSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personImageUrl: {
        type: String,
        required: true
    },
    clothImageUrl: {
        type: String,
        required: true
    },
    resultImageUrl: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('TryOn', tryOnSchema);
