const toS3 = require('./toS3.js');
const config = require('./config.json');
const host = config.s3Url;
const uploader = require('./uploader.js').uploader;
const passModule = require('./passModule.js');
const moduleDataBase = require('./moduleDataBase.js');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const compression = require('compression');
const { getSessionFromSocket } = require('socket-cookie-session');
const secret = require('./secrets.json').sessSecret;
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(cookieSession({
 secret: process.env.SESSION_SECRET || secret, 
 maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(compression());
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get('/', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
})

app.get('/welcome', function(req, res) {
	if (req.session.user) {
		return res.redirect('/');
	}
    res.sendFile(__dirname + '/index.html');
})

app.post('/register', function(req, res) {
    const {first, last, email, pass} = req.body;
    passModule.hashPassword(pass)
    .then((hashedpassword) => {
        moduleDataBase.postNewRegister(first, last, email, hashedpassword)
        .then((userId) => {
            req.session.user = {
                id: userId
            }
            res.json({
                success: true
            })
            
        })
    })
    .catch((err) => {
        console.log('/register-post', err.stack);
    }) 
})

app.post('/login', function(req, res) {
    const {email, pass} = req.body;
    moduleDataBase.getPass(email)
    .then((hashPassword) => {
        passModule.checkPassword(pass, hashPassword)
        .then((doesMatch) => {
            if (doesMatch) {
                moduleDataBase.getUserId(email)
                .then((userId) => {
                    req.session.user = {
                        id: userId 
                    }
                    res.json({
                        success: true
                    })
                })
            }
        })        
    })
    .catch((err) => {
        console.log('hashPassword', err.stack);
    })                
})

app.post('/upload', uploader.single('file'), toS3.uploadToS3, function(req, res) {
    if (req.file) {
        moduleDataBase.addPicToDb(req.file.filename, req.session.user.id)
        .then(() => {
            res.json({
                success: true,
                filename: host + req.file.filename
            })
        })
        .catch((err) => {
            console.log('app.post(/upload)', err.stack);
        })
    } else {
        res.json({
            success: false
        })
    }
})

app.get('/user', function(req,res) {
    moduleDataBase.getUserData(req.session.user.id)
    .then((userData) => {
        var userProfile = {
            id: userData.id,
            first: userData.first,
            last: userData.last,
            bio: userData.bio
        }
        userProfile.pic = userData.pic ? host + userData.pic : null;
        res.json({userProfile}) 
    })
    .catch((err) => {
            console.log('app.get(/user)', err.stack);
    }) 
})

app.post('/bio', function(req, res) {
    moduleDataBase.addBioToDb(req.body.bio, req.session.user.id)
    .then(() => {
        res.json({
            success: true
        })
    })
    .catch((err) => {
            console.log('app.post(/bio)', err.stack);
        res.json({
            success: false
        })
    })
})

app.get('/user/:id/other', function(req, res) { //the url should be different from client side (axios.get) => add to :id smth (or to any other place), don't forget to add this additional part of url to the client side as well - axios.get('/user/' + this.state.id + '.json')
    if (req.params.id == req.session.user.id) {
        res.json({
            ownProfile: true
        })    
    } else {
        moduleDataBase.getOtherUserProfile(req.params.id)
        .then((otherUserData) => {
            var otherUserProfile = {
                id: otherUserData.id,
                first: otherUserData.first,
                last: otherUserData.last,
                bio: otherUserData.bio
            }
            otherUserProfile.pic = otherUserData.pic ? host + otherUserData.pic : null;
            res.json(otherUserProfile)    
        })
    }
})

app.post('/friend_request', function(req, res) {
    moduleDataBase.checkFriendStatus(req.session.user.id, req.body.recipient)
    .then((result) => {
        var newStatus;
        if (result) {
            if (req.body.message == 'Cancel' || req.body.message == 'Unfriend') {
                message = 'Add Friend';
                moduleDataBase.deleteFriendship(req.session.user.id, req.body.recipient)
                .then(() => { 
                    res.json({
                        message: message
                    })
                })
            } else if (req.body.message == 'Accept') {
                newStatus = 2;
                message = 'Unfriend';
                moduleDataBase.updateFriendStatus(req.session.user.id, req.body.recipient, newStatus)
                .then(() => { 
                    res.json({
                        message: message
                    })
                })
            } 
        } else {
            newStatus = 1;
            moduleDataBase.sendFriendRequest(req.session.user.id, req.body.recipient, newStatus)
            .then(() => {
                var message = '';
                if (req.session.user.id !== req.body.recipient) {
                    message = 'Cancel';    
                } else {
                    message = 'Acept';   
                }  
                res.json({
                    message: message
                }) 
            })
            .catch((err) => {
                    console.log('sendFriendRequest', err.stack);
            }) 
        }
    })
    .catch((err) => {
            console.log('checkFriendStatus', err.stack);
    })    
})

app.get('/check-friend-status/:id', function(req, res) {
    moduleDataBase.checkFriendStatus(req.session.user.id, req.params.id)
    .then((status) => {
        var message = '';
        if (!status || !status.status) {
            message = 'Add Friend';
        } else if (req.session.user.id == status.sender_id) {
            if (status.status == 1) {
                message = 'Cancel'
            } else if (status.status == 2) {
                message = 'Unfriend'
            }
        } else if (req.session.user.id == status.recipient_id) {
            if (status.status == 1) {
                message = 'Accept'
            } else if (status.status == 2) {
                message = 'Unfriend'
            }
        }
        res.json({
            message: message
        })
    })
    .catch((err) => {
        console.log('app.get(/check-friend-status)', err.stack);
    }) 
})

app.get('/getfriends', function(req, res) { 
    moduleDataBase.getListOfFriends(req.session.user.id)
    .then((listOfFriends) => {
        for (var i = 0; i < listOfFriends.length; i++) {
            listOfFriends[i].pic = listOfFriends[i].pic ? host + listOfFriends[i].pic : null;   
        }
        res.json({
            data: listOfFriends
        })
    })
    .catch((err) => {
        console.log('app.get(/getfriends)', err.stack);
    }) 
})


app.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
}) 


app.get('*', function(req, res) {
    if (!req.session.user) {
        res.redirect('/welcome');
    } else {   
        res.sendFile(__dirname + '/index.html');
    }
});

var onlineUsersList = [];
var messages = [];
var countMsg = 0;
io.on('connection', function(socket) {

    const session = getSessionFromSocket(socket, {
        secret: secret
    });

    if (!session || !session.user) {
        return socket.disconnect(true);
    }
    onlineUsersList.push({
        socketId: socket.id,
        userId: session.user.id
    })

    var setOfIds = new Set();
    onlineUsersList.forEach(elem => {
        setOfIds.add(elem.userId)
    })
    var arrayOfIds = [...setOfIds];//новый синтаксис конвертирования объекта в массив

    moduleDataBase.getUsersByIds(arrayOfIds)
    .then((usersData) => {
        for (var i = 0; i < usersData.length; i++) {
            usersData[i].pic = usersData[i].pic ? host + usersData[i].pic : null;
        }
        socket.emit('onlineUsers', usersData);
        socket.emit('chatMessages', messages);

        var filteredOnlineUsers = onlineUsersList.filter(user => user.userId == session.user.id);
        if (filteredOnlineUsers.length === 1) {
            moduleDataBase.getOnlineUserData(session.user.id)
            .then((onlineUserData) => {
                onlineUserData.pic = onlineUserData.pic ? host + onlineUserData.pic : null;
                socket.broadcast.emit('userJoined', onlineUserData)
            })
            .catch((err) => {
                console.log('getOnlineUserData', err.stack);
            }) 
        }
    })
    .catch((err) => {
        console.log('getUsersByIds', err.stack);
    }) 

    socket.on('chatMessage', function(message) {
        moduleDataBase.getOnlineUserData(session.user.id)
        .then((userData) => {
            userData.pic = userData.pic ? host + userData.pic : null;
            const singleMsg = {
                message,
                userData
            }
            messages.push(singleMsg);
            countMsg ++;
            if (countMsg >= 10) {
                countMsg = 0;
                messages = [];
            }
            io.sockets.emit('chatMessage', singleMsg)    
        })
    })

    socket.on('disconnect', function() {
        var newUsersList = [];
        for (var i = 0; i < onlineUsersList.length; i++) {
            //loop through online users, find user socket id. Remove, and check if its last
            if (onlineUsersList[i].socketId == socket.id) {
                onlineUsersList.splice(i, 1);
                break;
            }
        }
        onlineUsersList.forEach(elem => {
            newUsersList.push(elem.userId)
        })
        moduleDataBase.getUsersByIds(newUsersList)
        .then((stayedUsersData) => {
            for (var i = 0; i < stayedUsersData.length; i++) {
                stayedUsersData[i].pic = stayedUsersData[i].pic ? host + stayedUsersData[i].pic : null;
            }
            socket.broadcast.emit('userLeft', stayedUsersData)
        })
    })
    //поменять лучше выше код написанный на см. ниже
    // var onLineUser = onlineUsersList.find(user => user.userId == session.user.id);
    // if (!onLineUser) {
    //     io.emit('userLeft', session.user.id);
    // }

});

server.listen(8080, function() {
    console.log("I'm listening.");
});

// <--w W-->
