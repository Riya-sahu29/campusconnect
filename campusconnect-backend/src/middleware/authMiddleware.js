import jwt from 'jsonwebtoken';
import { findUserById} from '../model/userModel.js';

export const protect = async (req, res, next) => {
    try {
        const authHeader = req. headers.authorization;
        if (!authHeader || !authHeader. startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized, no token provided'});
        }
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findUserById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists'});

        }
        if (!user.is_active) {
            return res.status(403).json({ message: 'Account has been deactivated' });
        }

        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invaild or expired token'});
    }
};