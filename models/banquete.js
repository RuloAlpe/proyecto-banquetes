var mongoose = require('mongoose');
var config = require('../config/database');
var Platillo = require('./platillo');
var User = require('./user');

var PlatilloSchema = mongoose.model('Platillo').schema;

//Banquete schema
var BanqueteSchema = mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    entrada: [PlatilloSchema],
    sopa: [PlatilloSchema],
    platoFuerte: [PlatilloSchema],
    /*entrada:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Platillo'
    },*/
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
    direccion:{
        type: String
    },
    /*fch_entrega: {
        required: false,
        type: Date
    }*/
});

var Banquete = module.exports = mongoose.model('Banquete', BanqueteSchema);