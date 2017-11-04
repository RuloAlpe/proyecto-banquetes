var mongoose = require('mongoose');
var config = require('../config/database');
var Platillo = require('./platillo');

//Banquete schema
var BanqueteSchema = mongoose.Schema({
    entrada: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Platillo'
    }],
    sopa: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Platillo'
    }],
    platoFuerte: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Platillo'
    }],
    personas: {
        required: true,
        type: Number
    },
    precio: {
        required: true,
        type: Number
    },
    mesas: {
        type: Number
    },
    sillas: {
        type: Number
    },
    fch_creacion: {
        required: true,
        type: Date,
        default: Date.now
    },
    fch_entrega: {
        required: false,
        type: Date
    },
});

var Banquete = module.exports = mongoose.model('Banquete', BanqueteSchema);