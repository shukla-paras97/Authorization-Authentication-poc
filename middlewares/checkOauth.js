const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
exports.verify = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.CLIENT_ID// Specify the CLIENT_ID of the app that accesses the backend
    });
    let user = {};
    const payload = ticket.getPayload();
    user.googleId = payload.sub;
    user.name = payload.name;
    user.avatar = payload.picture,
    user.email = payload.email,
    user.signinType = 'GOOGLE'

}