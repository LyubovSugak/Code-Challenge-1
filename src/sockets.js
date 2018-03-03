import * as io from 'socket.io-client';
import { store } from './start';
import { connect } from 'react-redux';
import { addOnLineUsers, userJoined, userLeft } from './actions-online';
import { sendMessage, chatMessages } from './actions-chat';
let socket;

export default function getSocket() {
	
	if (!socket) {
		socket = io.connect();
		socket.on('onlineUsers', function(usersData) {
            store.dispatch(addOnLineUsers(usersData));
        });
        socket.on('userJoined', function(onlineUserData) {
        	store.dispatch(userJoined(onlineUserData))
        })
        socket.on('userLeft', function(stayedUsersData) {
        	store.dispatch(userLeft(stayedUsersData))
        })
        socket.on('chatMessage', function(singleMsg) {
        	store.dispatch(sendMessage(singleMsg))
        })
        socket.on('chatMessages', function(messages) {
        	store.dispatch(chatMessages(messages))
        })
	}
	return socket;
}

export function sendChatMess(msg) {
	socket.emit('chatMessage', msg)
}