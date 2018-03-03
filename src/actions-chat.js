export function sendMessage(singleMsg) {
	return {
		type: 'SEND_MESSAGE',
		singleMsg
	}
}
export function chatMessages(messages) {
	return {
		type: 'CHAT_MESSAGES',
		messages
	}
}