import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class RegisPopover extends Component {
    constructor(props) {
        super(props);
        this.password = '';
        this.username = '';
    }

    render() {
        return (<Popover
            anchorEl={this.props.anchor}
            open={this.props.open}
            onClose={() => this.props.onClose()}
            style={{ zIndex: 5000 }}>
            <TextField
                label="username"
                defaultValue={this.username}
                onChange={(i) => {
                    this.username = i.target.value;
                }} />
            <br />
            <TextField
                label="password"
                type="password"
                defaultValue={this.password}
                onChange={(i) => {
                    this.password = i.target.value;
                }} />
            <br />
            <Button
                variant="raised"
                color="primary"
                onClick={() => {
                    this.props.asyncReq({
                        username: this.username,
                        password: this.password,
                    });
                    this.username = '';
                    this.password = '';
                    this.netid = '';
                    this.props.onClose();
                }}>Register</Button>
        </Popover>);
    }
}

export default RegisPopover;
