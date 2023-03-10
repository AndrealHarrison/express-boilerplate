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
    res.send({msg: `user: ${username} created! Token: ${token}`});
});

router.post('/login', (req, res) => {
    var user = req.query.username;
    let objSession = sessions.find(x => x.username === user);
    let objUser = users.find(x => x.username === user);
    if(objSession) {
        jwt.verify(objSession.token, objUser.password, function(err, decoded){
            if(!err){
                var msg = `user ${user} successfully logged in! Token: ${objSession.token}`;
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

router.get('/getPosts', (req, res) => {
    res.send(posts);
});

router.delete('/deletePost/:id', (req, res) => {
    let id = req.params.id;
    const {username} = req.body;
    let objUser = users.find(x => x.username === username);
    let token = req.headers.authorization;
    token = token.split(' ')[1];
    jwt.verify(token, objUser.password, function(err, decoded){
        const postToBeDeleted = posts.find(x => x.postID === parseInt(id));
        if(parseInt(objUser.userID) === postToBeDeleted.userID) {
            var index = posts.findIndex(x => x.postID === parseInt(id));  
            posts.splice(index, 1);
            res.send("post deleted");
        }
        else {
            res.send("Unauthorized user!");
        }
    });
    res.send("Unauthorized user!");
});

router.put('/updatePost/:id', (req, res) => {
    let id = req.params.id;
    const {username} = req.body;
    let objUser = users.find(x => x.username === username);
    let token = req.headers.authorization;
    token = token.split(' ')[1];
    jwt.verify(token, objUser.password, function(err, decoded){
        const postToBeEdited = posts.find(x => x.postID === parseInt(id));
        if(parseInt(objUser.userID) === postToBeEdited.userID) {
            var index = posts.findIndex(x => x.postID === parseInt(id));  
            posts[index].post = "this post has been edited!";
            res.send("post edited");
        }
        else {
            res.send("Unauthorized user!");
        }
    });
    res.send("Unauthorized user!");
});


module.exports = router;