const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');



/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               myadmin:
 *                 type: string
 *               agencies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createUser = async (req, res) => {
    const { username, email, password, role,  myadmin, agencies } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Utilisateur déjà existant' });
        if (req.user.role == "admin" && role != "consultant") return res.status(400).json({ message: 'seul le superadmin peut créer un compte administrateur' });
        if (req.user.role == "consultant") return res.status(400).json({ message: 'seul les admin et superadmin peut créer un compte administrateur' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const data = req.user.role == "admin" ? new User({
            username,
            email,
            role,
            password: hashedPassword,
            myadmin: req.user.email,
           
          
            agencies: req.user.agencies,
        }) : new User({
            username,
            email,
            role,
            password: hashedPassword,
            myadmin,
           
            agencies,
        });

        const dataToSave = await data.save();
        return res.status(200).json({ ...dataToSave._doc, password: null, message: 'Utilisateur créé avec succès' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
const getUsers = async (req, res) => {
    try {
        let users;

        if (req.user.role === 'superadmin') {
            // Superadmin can fetch all users
            users = await User.find()
                .populate('agencies')
                .select('-password');
        } else if (req.user.role === 'admin') {
            // Admin can fetch users where their email is in `myadmin` or matches `email`
            users = await User.find({
                $or: [
                    { myadmin: { $in: [req.user.email] } },
                    { email: req.user.email }
                ]
            })
                .populate('agencies')
                .select('-password');
        } else if (req.user.role === 'consultant') {
            users = await User.find({ email: req.user.email }).populate('agencies').select('-password');
        } else {
            // Forbidden access for other roles
            return res.status(403).json({ message: 'Accès refusé' });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User's ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        let user;

        if (req.user.role === 'superadmin') {
            user = await User.findById(id).populate('agencies').select('-password');
        } else if (req.user.role === 'admin') {
            user = await User.findOne({
                _id: id,
                $or: [
                    { myadmin: { $in: [req.user.email] } },
                    { email: req.user.email }
                ]
            })
                .populate('agencies')
                .select('-password');
        } else if (req.user.role === 'consultant') {
            user = await User.findOne({
                _id: id,
                $or: [
                    { email: req.user.email }
                ]
            }).populate('agencies').select('-password');
        } else {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */

const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Restrict updates to superadmin account with specific email
        if (userToUpdate.role === 'superadmin' && userToUpdate.email === 'trackingemkatech@gmail.com') {
            if (req.user.email !== 'trackingemkatech@gmail.com') {
                return res.status(403).json({ message: 'Seul le superadmin spécifique peut mettre à jour ce compte' });
            }

            // Prevent email or role updates
            if (updates.email || updates.role) {
                return res.status(403).json({ message: 'Modification de l’e-mail ou du rôle non autorisée pour ce compte' });
            }
        }

        // Hash password if provided
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true })
            .populate('agencies')
            .select('-password');

        return res.status(200).json({
            ...updatedUser._doc,
            password: null,
            message: 'Utilisateur mis à jour avec succès',
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Prevent deletion of the specific superadmin account
        if (userToDelete.role === 'superadmin' && userToDelete.email === 'trackingemkatech@gmail.com') {
            return res.status(403).json({ message: 'Suppression du superadmin spécifique non autorisée' });
        }

        let deletedUser;
        if (req.user.role === 'superadmin') {
            deletedUser = await User.findByIdAndDelete(id);
        } else if (req.user.role === 'admin') {
            if (id === req.user.id) {
                return res.status(403).json({ message: 'Les administrateurs ne peuvent pas supprimer leur propre compte' });
            }

            deletedUser = await User.findOneAndDelete({
                _id: id,
                myadmin: { $in: [req.user.email] },
            });
        } else {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        if (!deletedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé ou accès refusé' });
        }

        return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
