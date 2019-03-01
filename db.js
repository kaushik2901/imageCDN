const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    img: { 
        data: Buffer, 
        contentType: String 
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true } );

module.exports = {
    Image: mongoose.model('Image', imageSchema),
    imageSchema: imageSchema
}