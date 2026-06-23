const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        console.log('auth.middleware entered');
        const authHeader = req.headers.authorization;
        console.log('auth.header=', authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Bearer token

        if (!process.env.JWT_SECRET) {
            console.error('Missing JWT_SECRET in environment');
            return res.status(500).json({ message: 'Server misconfiguration' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error('JWT verify failed', err && err.message);
            return res.status(401).json({ message: "Invalid token" });
        }

        console.log('auth.decoded=', decoded);
        req.user = decoded; // attach user info to request

        next();
    } catch (err) {
        console.error('auth.middleware error', err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;