const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('role.middleware entered, allowedRoles=', allowedRoles);
        if (!req.user) {
            console.log('role.middleware: req.user is missing');
            return res.status(401).json({ message: "Unauthorized" });
        }

        console.log('role.middleware: user role=', req.user.role);
        if (!allowedRoles.includes(req.user.role)) {
            console.log('role.middleware: access denied for role', req.user.role);
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
};

module.exports = roleMiddleware;