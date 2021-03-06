const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../models/User');
const Ufersa = require('../models/Ufersa');

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.NAME_CLOUDINARY, 
    api_key: process.env.API_KEY_CLOUDINARY, 
    api_secret: process.env.API_SECRET_CLOUDINARY
  });
// @route    POST api/users
// @desc     Register user
// @access   Public
// tested
router.post('/',
    [
        check('name', 'O nome é requerido!').not().isEmpty(),
        check('email', 'Por favor, inclua um email válido!').isEmail(),
        check(
          'password',
          'Por favor, digita uma senha com um mínimo de 8 dígitos!'
        ).isLength({ min: 8 }),
        check(
            'ufersaId',
            'Por favor, digita uma matrícula com 10 dígitos!'
          ).isLength({ min: 10, max: 10 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, email, password, ufersaId } = req.body;

            const fileStr = req.body.previewSource;

            const uploadResponse = await cloudinary.uploader.upload(fileStr);

            let user = await User.findOne({ email });

            const matricula = await Ufersa.findOne({ufersaId: ufersaId});

            if (user) {
                return res.status(400).json({ errors: [{msg: 'Um usuário já foi cadastrado com esse email'}] });
            }

            if (!matricula) {
                return res.status(400).json({ errors: [{msg: 'Não há madricula cadastrada com esse número'}] });
            }


            user = new User({
                name,
                email,
                ufersaId,
                password,
                avatar: uploadResponse.secure_url
            });

            const salt = await bcrypt.genSalt(15);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '1hr' },
                (err, token) => {
                  if (err) throw err;
                  res.json({ token });
                }
            );

        } catch (err) {
            return res.status(400).json({ errors: [{msg: 'Erro inesperado, talvez um usuário já esteja cadastrado com essa matrícula!'}] });
        }
    }
);

module.exports = router;