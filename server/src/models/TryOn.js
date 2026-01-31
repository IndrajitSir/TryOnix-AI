import mongoose from 'mongoose';

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

export default mongoose.model('TryOn', tryOnSchema);
