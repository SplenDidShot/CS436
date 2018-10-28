import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { notify } from 'react-notify-toast';

import FriendList from './FrientList';

const styles = {
    root: {
        width: '100%',
    },
    avatar: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '100%',
        width: '100%',
    },
    follow_button: {
        backgroundColor: '#9C27B0',
        width: '80%',
        height: '70px',
        color: 'white',
    },
};

class UserInfoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openFriendList: false,
            openFollow: false,
        };
    }

    anchor = null;
    followAnchor = null;
    nameBuffer = '';
    handleFriendList = () => {
        this.setState({ ...this.state, openFriendList: true });
    };
    handleOpenFollow = () => {
        this.setState({ ...this.state, openFollow: true });
    };

    asyncFollow = (name) => {
        axios.post('follow', { friend_name: name }).then(
            (response) => {
                notify.show('Follow successfully!', 'success');
                console.log(response);
            },
            (error) => {
                if (error.response.status === 404) {
                    notify.show('User does not exist!', 'error');
                } else {
                    notify.show(`Server issue! Fail to follow ${name}`, 'error');
                }
                console.log(error);
            },
        );
    }

    render() {
        return (
            <List className={this.props.classes.root}>
                <ListItem
                    component={Avatar}
                    alt={this.state.name}
                    className={this.props.classes.avatar}
                    src={this.state.image}>
                    {null}
                </ListItem>
                <ListItem>
                    <Grid container>
                        <Grid item xs={3} />
                        <Grid item xs={3} style={{ color: 'black', fontSize: '20pt' }}>{this.props.name}</Grid>
                        <Grid item xs={3} />
                    </Grid>
                </ListItem>
                <Divider />
                <List component="nav">
                    <div ref={node => (this.anchor = node)} />
                    <ListItem button onClick={this.handleFriendList}>
                        <ListItemText primary="Friend" />
                        <Popover
                            anchorEl={this.anchor}
                            open={this.state.openFriendList}
                            onClose={() =>
                                this.setState({ ...this.state, openFriendList: false })
                            }>
                            <FriendList />
                        </Popover>
                    </ListItem>
                    <ListItem>
                        <div ref={node => this.followAnchor = node}>
                            <Button
                                color="primary"
                                className={this.props.classes.follow_button}
                                onClick={() => {
                                    this.handleOpenFollow();
                                }}>FOLLOW</Button>
                            <Popover
                                open={this.state.openFollow}
                                anchorEl={this.props.anchor}
                                onClose={() => {
                                    this.setState({ ...this.state, openFollow: false });
                                }}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    onChange={(e) => {
                                        this.nameBuffer = e.target.value;
                                    }} />
                                <Button onClick={() => {
                                    this.asyncFollow(this.nameBuffer);
                                    this.nameBuffer = '';
                                }}>Follow</Button>
                            </Popover>
                        </div>
                    </ListItem>
                </List>
            </List>
        );
    }
}

UserInfoList.propTypes = {
    name: PropTypes.string,
};
UserInfoList.defaultProps = {
    name: 'gg',
};
export default withStyles(styles)(UserInfoList);
