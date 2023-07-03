const supabase = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');

dotenv.config();

class AuthController {
    async signUp(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Registration failed: " + errors.errors[0].msg})
            }

            const {email, password} = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const { error } = await supabase.from('users').insert({email: email, password: hashedPassword});

            const { data } = await supabase.from('users').select('*').eq('email', email);

            const user = data[0];

            const accessToken = jwt.sign({userId: data.id}, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_TTL});

            const refreshToken = jwt.sign({userId: data.id}, process.env.JWT_SECRET);

            if (error) {
                throw new Error('Failed to register user');
            }

            res.status(201).json({success: true, data: {
                    id: user.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }});
        } catch (error) {
            res.status(409).json({success: false, error: error.message});
        }
    }

    async signIn(req, res) {
        try {
            const {email, password} = req.body;

            const {data: users, error} = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .limit(1);

            if (error || !users.length) {
                throw new Error('Invalid email');
            }

            const user = users[0];

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_TTL});

            const refreshToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET);

            res.status(200).json({
                success: true,
                data:
                    {id: user.id, accessToken, refreshToken}
            });
        } catch (error) {
            res.status(409).json({success: false, error: error.message});
        }
    }

    async getUser(req, res) {
        try {
            const userId = req.userId;

            const {data: users, error} = await supabase
                .from('users')
                .select('id, email')
                .eq('id', userId)
                .limit(1);

            if (error || !users.length) {
                throw new Error('User not found');
            }

            const user = users[0];

            res.json({success: true, user});
        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    }

}

module.exports = new AuthController();