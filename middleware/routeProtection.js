import jwt from 'jsonwebtoken';

const routeProtection = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        return res.status(403).json({ message: 'Invalid token.' });
    }
}

export default routeProtection