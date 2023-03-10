var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

let users = [
    {
        'userID': '1',
        "username": "admin",
        "password": "password"
    }
]

let sessions = [
    {
        'sessionId': '3242334',
        'token': 'sadsdfdsfsdfdf',
        'username': 'name'
    }
]

let posts = [
    {
        'postID': getRandomInt(1000),
        'post': 'this is a sample post',
        'userID': getRandomInt(1000)
    }
]

router.post('/signup', (req, res) => {
    if(!req.body || !req.body.username || !req.body.password) {
        res.send(400, "Bad request");
        return;
    }

    const username = req.body.username;
    const password = req.body.password;

    users.push({
        userID: getRandomInt(1000),
        username: username,
        password: password
    })
    var token = jwt.sign({ username: username }, password, {expiresIn: 1000});
    sessions.push({
        sessionId: getRandomInt(1000),
        token: token,
        username: username
    })
    console.log(users)
    res.send({msg: `user: ${username} created!`});
});

router.post('/login', (req, res) => {
    var user = req.query.username;
    let objSession = sessions.find(x => x.username === user);
    let objUser = users.find(x => x.username === user);
    if(objSession) {
        jwt.verify(objSession.token, objUser.password, function(err, decoded){
            if(!err){
                var msg = `user ${user} successfully logged in!`;
                res.send(msg);
            } else {
                res.send(err);
            }
        })
    }
    else {
        res.send('Unauthorized Access');
    }
});

router.post('/createPost', (req, res) => {

    var user = req.query.username;
    let objUser = users.find(x => x.username === user);

    posts.push({
            'postID': getRandomInt(1000),
            'post': 'this is a sample post',
            'userID': objUser.userID
    });

    res.send("post created");

});


module.exports = router;