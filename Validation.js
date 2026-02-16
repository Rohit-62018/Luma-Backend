const Joi = require('joi');

module.exports.loginValidation = (req,res,next)=>{
    
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().required().min(4).max(50)
    })

    const {error} = schema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.message, succes:false });
        return;
    }
    next();
};

module.exports.signUpValidation = (req,res,next)=>{

    const schema = Joi.object({
        name:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().required().min(4).max(50)
    })

    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.message, succes:false });
        return;
    }
    next();
};

