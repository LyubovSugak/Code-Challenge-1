
export function addOnLineUsers(usersData) {
	return {
		type: 'ONLINE_USERS',
		usersData
	}
}
export function userJoined(onlineUserData) {
	return {
		type: 'USER_JOINED',
		onlineUserData
	}
}
export function userLeft(stayedUsersData) {
	return {
		type: 'USER_LEFT',
		stayedUsersData
	}
}
