import React, { Component } from 'react';
import Modal from 'material-ui/Modal';

class SendModal extends Component {
    constructor(props) {
        super(props);
        console.log({ ...this.props });
        this.state = { open: false };
    }
    handleOpen=() => {
        this.setState({ ...this.state });
    }
    render() {
        return <Modal {...this.props}>HHH</Modal>;
    }
}

export default SendModal;
