const express = require("express");
const User = require("../models/User");
const apiResponder = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require('express-session');

//1 Register User
exports.registerUser = async (request, response, next) => {
    try {
        let responseCode;
        if (errorHandler.validate(['firstname', 'lastname', 'email', 'password'], request.body)) {
            return errorHandler.createError(1003);
        }
        let { email, password } = request.body;
        //email already present
        let user = await User.findOne({ 'email': email })
        if (user) {
            responseCode = 2001;
            return apiResponder(request, response, next, true, responseCode, {});
        }
        request.body.password = bcrypt.hashSync(request.body.password, 10);
        await User.create(request.body);
        responseCode = 4001;
        return apiResponder(request, response, next, true, responseCode, {});
    } catch (error) {
        next(error);
    }
}


//2.Login User
exports.loginUser = async (request, response, next) => {
    try {
        let responseCode;
        if (errorHandler.validate(['email', 'password'], request.body)) {
            return errorHandler.createError(1003);
        }

        let { email, password } = request.body;
        let result = email.endsWith("@gmail.com") ? true : false;
        if (!result) {
            responseCode = 2002;
            return apiResponder(request, response, next, true, responseCode, {});
        }
        let user = await User.findOne({ email: email })
        if (user) {
            let passwordIsValid = await bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                responseCode = 2002;
                return apiResponder(request, response, next, responseCode, {});
            }
            let token = jwt.sign({
                id: user._id,
                type: user.role
            }, process.env.JWT_SECRET_KEY, { expiresIn: '365d' });
            let data = {
                auth_token: token,
                id: user._id,
                role: user.role
            }
            await User.updateOne(
                { email: email },
                {
                    $set:
                    {
                        token: token
                    }
                }
            )
            responseCode = 4002;
            request.session.user = {
                userdetails: user
            }
            return apiResponder(request, response, next, true, responseCode, data);
        } else {
            responseCode = 2002;
            return apiResponder(request, response, next, true, responseCode, {});
        }

    } catch (error) {
        next(error);
    }
}



//3.logout
exports.logout = async (request, response, next) => {
    try {
        let responseCode;
        let token = await User.findOne({ token: request.token })
        if (token) {
            let deletedtoken = await User.updateOne(token,{
                $set:
                {
                    token: ""
                }
            });
           
            responseCode = 4003;
        } else {
            responseCode = 2003;
        }
        return apiResponder(request, response, next, true, responseCode, {});
    }
    catch (error) {
        next(error);
    }

}