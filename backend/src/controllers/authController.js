const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/database');

// Validation rules
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email válido es requerido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email válido es requerido'),
    body('password').notEmpty().withMessage('Contraseña es requerida')
];

// Generate JWT token
const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Register new user
const register = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('custom_users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'El usuario ya existe con este email'
            });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const { data: newUser, error: insertError } = await supabase
            .from('custom_users')
            .insert([
                {
                    email,
                    password_hash: passwordHash
                }
            ])
            .select('id, email, created_at')
            .single();

        if (insertError) {
            console.error('Database error:', insertError);
            return res.status(500).json({
                success: false,
                error: 'Error al crear el usuario'
            });
        }

        // Generate token
        const token = generateToken(newUser.id, newUser.email);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    created_at: newUser.created_at
                },
                token
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos de entrada inválidos',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const { data: user, error: findError } = await supabase
            .from('custom_users')
            .select('id, email, password_hash, created_at')
            .eq('email', email)
            .single();

        if (findError || !user) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Generate token
        const token = generateToken(user.id, user.email);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Logout user (client-side token removal, but we can blacklist if needed)
const logout = async (req, res) => {
    // Since we're using stateless JWT, logout is mainly handled client-side
    // But we can implement token blacklisting here if needed in the future
    res.json({
        success: true,
        message: 'Logout exitoso'
    });
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { data: user, error } = await supabase
            .from('custom_users')
            .select('id, email, created_at, updated_at')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
    registerValidation,
    loginValidation
};
