var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var config = require('../config/database');
var Banquete = require('../models/banquete');
var Platillo = require('../models/platillo')

router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        admin: false
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

    User.getUserByUsername(username, (err, user) => {
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

//guardar banquete en la BD
router.post('/guardar-banquete', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //console.log(req.user);
    
    let newBanquete = new Banquete({
        id_usuario: req.user._id,
        entrada: req.body.entrada,
        sopa: req.body.sopa,
        platoFuerte: req.body.platoFuerte,
        personas: req.body.personas,
        precio: req.body.precio,
        mesas: req.body.mesas,
        sillas: req.body.sillas,
        //fch_entrega: new Date(req.body.fch_entrega)
    });
    newBanquete.save().then(function(banquete){
        res.json(banquete);        
    }, function(err){
        res.status(400);
        res.json({
            'error': 'Bad Data. Guardar banquete '+err
        });
    });
});

router.get('/banquetes', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Banquete.find({id_usuario:req.user._id}, (err, banquetes) => {
        if(err){
            res.status(400);
            res.json({
                'error': 'Bad Data. Traer todos los banquetes'
            });
        }else{
            res.json(banquetes);
        }
    });
});

module.exports = router;