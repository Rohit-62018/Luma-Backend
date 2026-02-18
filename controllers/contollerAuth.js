const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { ExpressError } = require('../utils/ExpressError');
const { User } = require('../DataBase/Schema')


module.exports.login = async(req,res)=>{

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new ExpressError("User does't exist", 400);
    }

    if (!user.password) {
        throw new ExpressError("Please login with google", 400);
    }
        
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        throw new ExpressError("Invalid password", 400);
    }

    if (!user.otp.verify) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = {
            code: otp,
            verify: false,
            otpExpires: new Date(Date.now() + 2 * 60 * 1000)
        };

        await user.save();

        const transporter = nodemailer.createTransport({
        service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: ` Luma <${process.env.EMAIL}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
        });

        throw new ExpressError("Verify your email", 400);

    }

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, {
        httpOnly: true,
        maxAge:24 * 60*60*1000
    });
    
    return res.status(200).json({message:"login successfull", name:user?.name, success:true});
}


module.exports.signup = async(req,res)=>{
     
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw new ExpressError("User already exist", 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email,
        password: hashedPassword, otp: {
        code:otp,
        verify:false,
        otpExpires: new Date(Date.now() + 2 * 60 * 1000)}
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Luma" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
    });

    return res
        .status(201)
        .json({ message: "Varify your email", success: true });
        
}


module.exports.logout = (req, res) => {

    if (req.cookies?.token) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    }else{
        return res.status(400).json({ success: false, message: "User is already logged out" });
    }

}

module.exports.otpVerify = async(req,res)=>{

    const { email, otp } = req.body;
    const user = await User.findOne({email});

    if(!user){
      throw new ExpressError("User not found",400);
    }

    if(!user.otp || user.otp.code!==parseInt(otp)){
        throw new ExpressError("Invalid OTP",400);
    }

    if(user.otp.otpExpires < Date.now()){
        throw new ExpressError("OTP expired",400);
    }

    user.otp.verify = true;
    await user.save();

    const token = jwt.sign({ email:email, id:user._id },process.env.JWT_SECRET,{ expiresIn:'24h' } );
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:24*60*60*1000,
    })
        
    return res.status(200).json({
        message: "OTP verified successfully, account active",
        success: true,
        email: user.email,
        name: user.name,
    });
}

module.exports.isAuthenticated = async(req,res)=>{

    const user = await User.findOne({email:req.user.email});
    
    if (!user) throw new ExpressError("User not found",400);
    if(!user.otp.verify) throw new ExpressError("Please verify your email",400);

    if(req.user.id){
        const token  = jwt.sign(
            {email:req.user.email},
            process.env.JWT_SECRET,
            { expiresIn: req.user.exp - Math.floor(Date.now() / 1000) });
        res.cookie('token',token,{ 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: (req.user.exp - Math.floor(Date.now() / 1000)) * 1000
        })        
    }

    return res.status(200).json({ name: user.name, success:true}); 

};