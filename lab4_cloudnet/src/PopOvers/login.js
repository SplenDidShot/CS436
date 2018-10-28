import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class LoginPopOver extends Component {
    constructor(props) {
        super(props);
        this.username = '';
        this.password = '';
    }

    render() {
        return (<Popover
            anchorEl={this.props.anchor}
            open={this.props.open}
            onClose={() => this.props.onClose()}
            style={{ zIndex: 5000 }}>
            <TextField
                label="username"
                onChange={(i) => {
                    this.username = i.target.value;
                }} />
            <TextField
                label="password"
                type="password"
                onChange={(i) => {
                    this.password = i.target.value;
                }} />
            <Button onClick={() => {
                this.props.asyncReq({
                    username: this.username,
                    password: this.password,
                });
                this.username = '';
                this.password = '';
                this.props.onClose();
            }}>Sign
                in</Button>
        </Popover>);
    }
}

export default LoginPopOver;
