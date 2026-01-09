import User from '../../models/User.js';
import User from '../models/User.js';  

export const searchUsers = async (req, res) => {
    try {
        const { username, email, role } = req.query;
        
        const searchQuery = {};
        if (username) {
            searchQuery.username = { $regex: username, $options: 'i' };  
        }
        if (email) {
            searchQuery.email = { $regex: email, $options: 'i' };
        }
        if (role) {
            searchQuery.role = role;
        }

        const users = await User.find(searchQuery)
            .select('-password -confirmPassword') 
            .sort({ updatedAt: -1 });  

        if (!users.length) {
            return res.status(404).json({ message: 'No users found matching the criteria' });
        }

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};