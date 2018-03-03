export function reducer(state = {}, action) {
	
	if (action.type == 'GET_USER_PROFILE') {
		return Object.assign({}, state, {
			userProfile: action.userProfile
		})
	}
	if (action.type == 'RECEIVE_FRIENDS') {
		return Object.assign({}, state, {
            listOfFriends: action.listOfFriends
        });
	}
	if (action.type == 'ONLINE_USERS') {
		return Object.assign({}, state, {
            usersData: action.usersData
        });
	}
	if (action.type == 'USER_JOINED') {
		return Object.assign({}, state, {//[...state.userData, action.onlineUserData] || state.usersData.concat(action.onlineUserData)
			usersData: [...state.usersData, action.onlineUserData]
		})
	}
	if (action.type == 'USER_LEFT') {
		return Object.assign({}, state, {
			usersData: action.stayedUsersData
		})	
	}
	if (action.type == 'SEND_MESSAGE') {
		return Object.assign({}, state, {
			messages: [...state.messages, action.singleMsg]
		})
	}
	if (action.type == 'CHAT_MESSAGES') {
		return Object.assign({}, state, {
			messages: action.messages
		})
	}
	return state;
}