import express from "express";
import routes from "../Routes/routes";
import config from "../config/dev.json";
import bodyParser from "body-parser";

import jwt from "jsonwebtoken";
import passport from "passport";
import passportJWT from "passport-jwt";

import dev from '../config/dev';

import { getUser } from '../Routes/Users/user.service';



var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = dev.secret;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    getUser(jwt_payload.id, (err, user) => {
        if (user) {
            console.log('worked');
            next(null, user);
        } else {
            console.log('not worked');
            next(null, false);
        }
    });
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);
/*
TODO:
- Setup routes (use notes from Codeschool)
- Add routes for dealing with passport
- We need a route to register
- We need a route to login
*/

app.listen(config.server.port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port:" + config.server.port);
    }
});


