const axios = require('axios');
const jwt = require('jsonwebtoken');
const { ExpressError } = require('../utils/ExpressError');
const { User, Conversation } = require('../DataBase/Schema')
const prompt = require('../utils/prompt')



module.exports.Msg = async(req,res)=>{

    const { msg } = req.query;

    if(!msg || msg.trim()==='') throw new ExpressError("Message is required",400);

    const user = await User.findOne({email: req.user.email});

    if(!user) throw new ExpressError("User not found",400);
    if(!user.otp.verify) throw new ExpressError("Please verify your email",400);
    
    let chat;
    if (req.user.id) {
        chat = await Conversation.findById(req.user.id);
    } else {
        
        chat = new Conversation({ messages: [] });
        const titlePrompt = `Give me a short and clear title (max 4 words) for this chat message: ${msg}`;
        const titleResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    { role: "system", content: "You are a helpful assistant that writes concise chat titles." },
                    { role: "user", content: titlePrompt }
                ],
                max_tokens: 15
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Luma Chatbot",
                },
            }
        );
        const generatedTitle =
            titleResponse.data.choices?.[0]?.message?.content?.trim() || "New Chat";
        await chat.save();
        user.chats.push({ title: generatedTitle, conversation: chat._id });
        await user.save();
    }

    if (!chat) throw new ExpressError("Conversation not found",404);
    
    const previousMessages = chat.messages.slice(-10).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.msg,
    }));

    const systemPrompt = {
            role: "system",
            content: prompt
            };

    const messages = [
        systemPrompt,
        ...previousMessages,
        { role: "user", content: msg }
    ];

    const aiResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: messages,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Luma Chatbot",
            },
        } 
        );

    const reply = aiResponse.data.choices?.[0]?.message?.content;
        
    if (!reply) throw new ExpressError("Bot service unavailable",502);
    
    chat.messages.push({ msg, sender: 'user' }, { msg: reply, sender: 'bot' });
    await chat.save();
        const token  = jwt.sign(
            {email:req.user.email, id:chat._id},
            process.env.JWT_SECRET,
            { expiresIn: req.user.exp - Math.floor(Date.now() / 1000) });
    res.cookie('token',token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: (req.user.exp - Math.floor(Date.now() / 1000)) * 1000
        })

    return res.status(200).json({ reply, success:true });

};


module.exports.Chats = async(req,res)=>{

    const user = await User.findOne({email:req.user.email});

    if(!user) throw new ExpressError("User not found",400);
    if(!user.otp.verify) throw new ExpressError("Please verify your email",400);
    
    return res.status(200).json({chats: user.chats, success:true});
    
};


module.exports.Conversation = async(req,res)=>{

    const { id } = req.params;
    const user = await User.findOne({'chats.conversation': id});

    if(!user || user.email !== req.user.email) {
        throw new ExpressError("User not found",400);
    }
    
    if(!user.otp.verify) { 
        throw new ExpressError("Please verify your email",400);
    }

    const chat = await Conversation.findById(id);

    if (!chat) throw new ExpressError("Conversation not found",404);
    
    const token  = jwt.sign(
            {email:req.user.email, id:id},
            process.env.JWT_SECRET,
            { expiresIn: req.user.exp - Math.floor(Date.now() / 1000) });
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: (req.user.exp - Math.floor(Date.now() / 1000)) * 1000
        })

    return res.status(200).json({ chat, success: true });

}