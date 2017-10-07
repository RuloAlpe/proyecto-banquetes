var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Platillo = require('../models/platillo');

var config = require('../config/database');

router.post('/register-qwerty123-admin', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        admin: true
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Error al registrarse'});
        }else{
            res.json({success: true, msg: 'Exito al registrarse'});
            
        }
    });
});

router.post('/authenticate', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    User.getAdminByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'Usuario no encontrado'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 60400 // 1 semana
                });
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        admin: user.admin
                    }
                });
            }else{
                return res.json({success: false, msg: 'Password incorrecta'});     
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

//CRUD DE PLATILLOS EN GENERAL

//CRUD ENTRADAS
router.get('/entradas', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Platillo.find({tipo:1}, (err, entradas) => {
        if(err){
            res.status(400);
            res.json({
                'error': 'Bad Data. Traer todas las tareas'
            });
        }else{
            res.json(entradas);
        }
    });
});

router.post('/crear-entrada', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //console.log(req.body.title);
    //console.log(req.body.precio);
    let newEntrada = new Platillo({
        title: req.body.title,
        precio: req.body.precio,
        tipo: 1
    });
    newEntrada.save().then(function(entrada){
        res.json(entrada);        
    }, function(err){
        res.status(400);
        res.json({
            'error': 'Bad Data. Guardar entremes'
        });
    });
});

//CRUD SOPAS
router.get('/sopas', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Platillo.find({tipo:2}, (err, sopas) => {
        if(err){
            res.status(400);
            res.json({
                'error': 'Error get sopas'
            });
        }else{
            res.json(sopas);
        }
    });
});

router.post('/crear-sopa', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //console.log(req.body.title);
    //console.log(req.body.precio);
    let newSopa = new Platillo({
        title: req.body.title,
        precio: req.body.precio,
        tipo: 2
    });
    newSopa.save().then(function(sopa){
        res.json(sopa);        
    }, function(err){
        res.status(400);
        res.json({
            'error': 'Bad Data. Guardar primer tiempo'
        });
    });
});

router.get('/platos-fuertes', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Platillo.find({tipo:3}, (err, platosFuertes) => {
        if(err){
            res.status(400);
            res.json({
                'error': 'Error get platos fuertes'
            });
        }else{
            res.json(platosFuertes);
        }
    });
});

router.post('/crear-plato-fuerte', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //console.log(req.body.title);
    //console.log(req.body.precio);
    let newPlaFuerte = new Platillo({
        title: req.body.title,
        precio: req.body.precio,
        tipo: 3
    });
    newPlaFuerte.save().then(function(platilloFuerte){
        res.json(platilloFuerte);        
    }, function(err){
        res.status(400);
        res.json({
            'error': 'Bad Data. Guardar segundo tiempo'
        });
    });
});


module.exports = router;