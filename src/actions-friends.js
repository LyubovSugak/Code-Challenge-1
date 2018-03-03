import axios from 'axios';

export function receiveFriends() {
	return axios.get('/getfriends')
	.then((res) => {
		return {
			type: 'RECEIVE_FRIENDS',
			listOfFriends: res.data.data
		}
	})
}