import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dev from '../../config/dev';
import passport from 'passport';

import { storePassword, verifyPassword, getUser } from './user.service';

const router = express.Router();

router.route('/reg')
    //POST: api/user/reg - we are registering a user
    .post((req, res) => {
        console.log(req.body);
        storePassword(req.body, function (err) {
            if (err) {
                res.status(400).json(err);
            }
            else {
                res.status(200).json('ok');
            }
        });
    });

router.route('/auth')
    //POST: api/user/auth - we are authenticating a user and returning a token
    .post((req, res) => {
        verifyPassword(req.body, function (err, result, id) {
            if (err) {
                res.status(400).json('fail');
            }
            else {
                if (result) {
                    let payload = { id: id };
                    let token = jwt.sign(payload, dev.secret);
                    res.status(200).json({ message: 'ok', token: token });
                }
                else {
                    res.status(401).json('wrong');
                }
            }
        });
    })
    .get(passport.authenticate('jwt', { session: false }), function (req, res) {
        res.status(200).json("Success! You can not see this without a token");
    });
module.exports = router;