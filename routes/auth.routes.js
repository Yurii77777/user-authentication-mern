const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

// /api/auth/register
router.post(
    "/register",
    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Minimum password length is 8 characters").isLength({
            min: 8,
        }),
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).json({
                    errors: validationErrors.array(),
                    message: "Incorrect data during registration!",
                });
            }

            const { nickname, email, password } = req.body;

            const isUser = await User.findOne({ email });

            if (isUser) {
                return res
                    .status(400)
                    .json({ message: "This user already exists!" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                nickname,
                email,
                password: hashedPassword,
            });
            await user.save();

            res.status(201).json({ message: "New user has been created" });
        } catch (error) {
            res.status(500).json({
                message: `New user registration error! ERROR message: ${error.message}`,
            });
        }
    }
);

// /api/auth/login
router.post(
    "/login",
    [
        check("email", "Please enter a valid email").normalizeEmail().isEmail(),
        check("password", "Enter your password").exists(),
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).json({
                    errors: validationErrors.array(),
                    message: "Incorrect login details!",
                });
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "User is not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: "Wrong password, please try again" });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                },
                config.get("jwtSecret"),
                { expiresIn: "1h" }
            );

            res.json({ token, userId: user.id });
        } catch (error) {
            res.status(500).json({
                message: `Login error! ERROR message: ${error.message}`,
            });
        }
    }
);

module.exports = router;
