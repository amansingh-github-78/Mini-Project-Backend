var jwt = require('jsonwebtoken');
const secret = 'aman@123'

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Invalid token credentials' });
    }
    try {
        const data = jwt.verify(token, secret);
        req.user = data;
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    next();
};

module.exports = fetchuser