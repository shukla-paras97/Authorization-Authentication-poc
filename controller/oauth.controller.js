const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const apiResponder = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

exports.googleLogin = async (request, response, next) => {
    try {
        if (errorHandler.validate(['token'], request.body)) {
            return errorHandler.createError(1003);
        }
        let token = req.body.token;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        if(userid){
            responseCode = 4004;
        }else{
             responseCode =2004;  
        }
        return apiResponder(request, response, next, true, responseCode, {});
      }
      
     catch(error){
         next(error);
     }
}





