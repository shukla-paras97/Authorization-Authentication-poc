const jwt = require('jsonwebtoken');
 
module.exports = (request, response, next) => {
  const token = request.get('AuthorizationToken');
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  request.user = decodedToken;
  request.token=token;

  next();
}

