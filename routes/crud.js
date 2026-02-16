const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({mergeParams:true});
const { isAuth } = require('../utils/isAuth');
const { Msg, Chats, Conversation } = require('../controllers/controllerChats');

router
    .get('/msg', isAuth, wrapAsync(Msg))
    .get('/chats',isAuth,wrapAsync(Chats))
    .get('/chat/:id',isAuth, wrapAsync(Conversation));
    

module.exports = router;
    