const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
    maxAge: expiresIn * 1000,
    httpOnly: true,
    secure: isProduction || process.env.LOCAL_HTTPS === 'true',
    sameSite: isProduction ? "Lax" : "Strict",
    path: '/', // Ensure cookie works across routes
};


// Set a signed JWT cookie
const setTokenCookie = (res, user) => {
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: Number(expiresIn) }
    );

    res.cookie('token', token, cookieOptions);
    return token;
};

// Restore user from JWT cookie

const restoreUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return next();

    try {
        const { data: { id } } = jwt.verify(token, secret);
        req.user = await User.scope('currentUser').findByPk(id);

        if (!req.user) res.clearCookie('token');
    } catch (error) {
        res.clearCookie('token');
    }

    return next();
};

//  Require authentication middleware
const requireAuth = [
    restoreUser,
    (req, _res, next) => req.user
        ? next()
        : next(Object.assign(new Error('Unauthorized'), {
            title: 'Unauthorized',
            errors: ['Unauthorized'],
            status: 401
        }))
];

module.exports = { setTokenCookie, restoreUser, requireAuth };
