import axios from 'axios';

export function getUserProfile() {
	return axios.get('/user')
	.then(({data}) => {
		return {
			type: 'GET_USER_PROFILE',
			userProfile: data.userProfile
		}
	})
}

