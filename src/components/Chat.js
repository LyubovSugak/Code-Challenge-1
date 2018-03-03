import React from 'react';
import { connect } from 'react-redux';
import { sendChatMess } from '../sockets'

export class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.sendMessage = this.sendMessage.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this)
	}
	componentDidUpdate() {
		this.scrollToBottom();
	}
	sendMessage(e) {
		let msg = this.textarea.value;
		e.preventDefault();
		sendChatMess(msg);
		this.textarea.value = '';
	}
	renderChat() {
		if (!this.props.messages) {
			return null;
		}
		return (
			this.props.messages.map((elem, i) => {
				var image = elem.userData.pic ? elem.userData.pic : "/static/default.jpeg";
				return (
					<div className="single-mess" key={i}>
						<div>
							<img src={image} />
							<div>{elem.userData.first} {elem.userData.last}</div>
						</div>
						<div>{elem.message}</div>
					</div>
				)

			})
		)
	}
	scrollToBottom() {
		const scrollHeight = this.messageList.scrollHeight;
		const height = this.messageList.clientHeight;
		const maxScrollTop = scrollHeight - height;
		this.messageList.scrollTop = maxScrollTop;
	}

	render() {
		return (
			<div className="big-chat-container">
				<h2>Chat</h2>
				<div className="messageList" ref={div => (this.messageList = div)}>
					{this.renderChat()}					
				</div>
				<textarea ref={textarea => (this.textarea = textarea)}></textarea>
				<div><br /><button onClick={e => this.sendMessage(e)}>SUBMIT</button></div>
			</div>


		)
	}
}

function mapStateToProp(state) {
	return ({
		messages: state.messages
	})
}

export default connect(mapStateToProp)(Chat);