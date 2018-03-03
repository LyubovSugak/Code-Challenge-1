const spicedPg = require('spiced-pg');
const dbUrl = process.env.DATABASE_URL || `postgres:${require('./secrets').dbUser}:${require('./secrets').dbPass}@localhost:5432/socialnetwork`;
const db = spicedPg(dbUrl);
const bcrypt = require('bcryptjs');

function postNewRegister(first, last, email, hashedpassword) {
	return db.query(`INSERT INTO users (first, last, email, hashedpassword)
					VALUES ($1, $2, $3, $4)
					RETURNING id`, [first, last, email, hashedpassword])
	.then((result) => {
		return result.rows[0].id;
	})
	.catch((err) => {
        console.log('postNewRegister function', err.stack);
    })
}

function getPass(userEmail) {
	return db.query(`SELECT hashedpassword FROM users WHERE email = $1`, [userEmail])
	.then((result) => {
		return result.rows[0].hashedpassword;
	})
	.catch((err) => {
        console.log('getPass function', err.stack);
    })

}

function getUserId(email) {
	return db.query(`SELECT id FROM users WHERE email = $1`, [email])
	.then((result) => {
		return result.rows[0].id;
	})
	.catch((err) => {
        console.log('getUserId function', err.stack);
    })
}

function addPicToDb(pic, userId) {
	return db.query(`UPDATE users
					SET pic = $1
					WHERE id = $2`, [pic, userId])
	.catch((err) => {
        console.log('addPicToDb function', err.stack);
    })
}

function getUserData(userId) {

	return db.query(`SELECT * FROM users WHERE id = $1`, [userId])
	.then((result) => {
		return result.rows[0]
	})
}

function addBioToDb(bio, userId) {
	return db.query(`UPDATE users
					SET bio = $1
					WHERE id = $2`, [bio, userId])
	.then((result) => {
		return result.rows[0]
	})
	.catch((err) => {
        console.log('addBioToDb function', err.stack);
    })
}

function getOtherUserProfile(userId) {
	return db.query(`SELECT * FROM users WHERE id = $1`, [userId])
	.then((result) => {
		return result.rows[0];
	})
}
function sendFriendRequest(sId, rId, status) {
	return db.query(`INSERT INTO friend_request (sender_id, recipient_id, status)
					VALUES ($1, $2, $3)`, [sId, rId, status])
	.then((result) => {
		// return result.rows[0].status;
	})
	.catch((err) => {
        console.log('sendFriendRequest function', err.stack);
    })
}

function updateFriendStatus(sId, rId, status) {
	return db.query(`UPDATE friend_request
					SET status = $3
					WHERE (sender_id = $1 AND recipient_id = $2)
					OR (sender_id = $2 AND recipient_id = $1)`,
					[sId, rId, status])
	.catch((err) => {
        console.log('updateFriendStatus function', err.stack);
    })
}
function deleteFriendship(sId, rId) {
	return db.query(`DELETE FROM friend_request WHERE sender_id = $1 AND recipient_id = $2
					OR (sender_id = $2 AND recipient_id = $1)`,
					 [sId, rId])
	.catch((err) => {
        console.log('deleteFriendship function', err.stack);
    })
}

function checkFriendStatus(sId, rId) {
	return db.query(`SELECT * FROM friend_request 
					WHERE (sender_id = $1 AND recipient_id = $2)
					OR (sender_id = $2 AND recipient_id = $1)`, [sId, rId])
	.then((result) => {
		if (!result.rows[0]) {
			return null
		} else {
			return result.rows[0];
		}
	})
	.catch((err) => {
        console.log('checkFriendStatus function', err.stack);
    })
}

function getListOfFriends(id) {
	const PENDING = 1, ACCEPTED = 2;
	return db.query(`SELECT users.id, first, last, pic, status
				    FROM friend_request
				    JOIN users
				    ON (status = ${PENDING} AND recipient_id = $1 AND sender_id = users.id)
				    OR (status = ${PENDING} AND sender_id = $1 AND recipient_id = users.id)
				    OR (status = ${ACCEPTED} AND recipient_id = $1 AND sender_id = users.id)
				    OR (status = ${ACCEPTED} AND sender_id = $1 AND recipient_id = users.id)`,
				 	[id])
	.then((result) => {
		return result.rows;
	})
}
function getUsersByIds(arrayOfIds) {
	return db.query(`SELECT * FROM users WHERE id = ANY($1)`, [arrayOfIds])
	.then((result) => {
		return result.rows;
	})
}
function getOnlineUserData(userId) {
	return db.query(`SELECT * FROM users WHERE id = $1`, [userId])
	.then((result) => {
		return result.rows[0];
	})
}



exports.postNewRegister  = postNewRegister;
exports.getPass = getPass;
exports.getUserId = getUserId;
exports.getUserData = getUserData;
exports.addPicToDb = addPicToDb;
exports.addBioToDb = addBioToDb;
exports.getOtherUserProfile = getOtherUserProfile;
exports.sendFriendRequest = sendFriendRequest;
exports.deleteFriendship = deleteFriendship;
exports.updateFriendStatus = updateFriendStatus;
exports.checkFriendStatus = checkFriendStatus;
exports.getListOfFriends = getListOfFriends;
exports.getUsersByIds = getUsersByIds;
exports.getOnlineUserData = getOnlineUserData;

