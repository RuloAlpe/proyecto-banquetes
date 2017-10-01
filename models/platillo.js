var mongoose = require('mongoose');
var config = require('../config/database');

//User schema
var PlatilloSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    precio: {
        required: true,
        type: Number
    },
    tipo: {
        required: true,
        type: Number
    }
});

var Platillo = module.exports = mongoose.model('Platillo', PlatilloSchema);
