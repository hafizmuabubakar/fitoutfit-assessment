const jwt = require('jsonwebtoken');


const getToken = function (user, expirationTimestamp, key) {
	return jwt.sign({ exp: expirationTimestamp, user: user }, key);
};


const validateToken = function (token, key) {
	return jwt.verify(token, key);
};

const generateAccessToken = function (user) {
	const accessTokenExpirationTime = Math.floor(Date.now() / 1000) + 60 * 60; //3600 = 1 hours
	const accessTokenScerete =
		process.env.ACCESS_TOKEN_SECRET_KEY || 'secretaccess';

	const token = getToken(
		{ userId: user.userId},
		accessTokenExpirationTime,
		accessTokenScerete,
	);

	return {
		access_token: token,
		expiration_timestamp: accessTokenExpirationTime,
	};
};

const generateRefreshToken = function (user) {
	const refreshTokenExpirationTime =
		Math.floor(Date.now() / 1000) + 3600 * (24 * 7); //3600 * (24 * 7) = 7 days
	const refreshTokenSecrete =
		process.env.REFRESH_TOKEN_SECRET_KEY || 'secretrefresh';

	return getToken(
		{ id: user.id, email: user.email, tenant_id: user.tenant_id },
		refreshTokenExpirationTime,
		refreshTokenSecrete,
	);
};

const generateResetPasswordToken = function (email) {
	const expiryTime = Math.floor(Date.now() / 1000 + 3600 * 5);
	const resetPasswordSecrete = process.env.RESET_PASSWORD_TOKEN_SECRET_KEY;

	return getToken({ email: email }, expiryTime, resetPasswordSecrete);
};

const generateActivationToken = function (email) {
	const expiryTime = Math.floor(Date.now() / 1000 + 3600 * 5);
	const userActivationTokenSecrete =
		process.env.USER_ACTIVATION_TOKEN_SECRET_KEY;

	return getToken({ email: email }, expiryTime, userActivationTokenSecrete);
};

const authenticate = (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) {
	  return res.status(401).json({ error: 'Authentication required' });
	}

	const data = validateToken(token, process.env.ACCESS_TOKEN_SECRET_KEY  || 'secretaccess');
	
	if(data && data.user){
		req.userId = data.user.userId;
		next();
	}
	else {
		return res.status(401).json({ error: 'Invalid token' });
	}
	
  };

module.exports = {
	validateToken,
	generateAccessToken,
	generateRefreshToken,
	generateResetPasswordToken,
	generateActivationToken,
	authenticate
};