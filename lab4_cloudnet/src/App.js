import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import { push as Menu } from 'react-burger-menu';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';
import Modal from 'material-ui/Modal';
import TextField from 'material-ui/TextField';
import Notifications, { notify } from 'react-notify-toast';
import { hot } from 'react-hot-loader';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import UserInfoList from './user_info/UserInfoList';
import PostList from './post/PostList';
import LoginPopOver from './PopOvers/login';
import RegisPopover from './PopOvers/regisPopover';

const PUBLIC = '/frinet';
const LOGIN = `${PUBLIC}/login`;
const REG = `${PUBLIC}/register`;

class App extends Component {
    state = {
        loading: true,
        openMenu: false,
        login: false,
        openModal: false,
        loginOpen: false,
        regisOpen: false,
        name: new Cookies().get('name'),
        cookies: new Cookies(),
        post: [],
    };

    componentWillMount() {
        if (this.state.cookies.get('token') !== undefined) {
            axios.defaults.headers.common.Authorization = `Token ${this.state.cookies.get('token')}`;
            this.state.login = true;
            this.asyncGetPost();
        }
    }


    content = '';

    handleLogin = (body) => {
        axios.post(LOGIN, body).then(
            () => {
                notify.show('Logged in!', 'success');
                axios.defaults.headers.common.Authorization = `Token ${this.state.cookies.get('token')}`;
                this.asyncGetPost();
                this.setState({ ...this.state, login: true, name: body.username });
                this.state.cookies.set('name', body.username);
            },
            (error) => {
                console.error(error);
                if (error.response.status === 403) {
                    notify.show('username/password not correct', 'error');
                } else {
                    notify.show('network issue!', 'error');
                }
            },
        );
    };
    handleRegister = (body) => {
        axios.post(REG, body).then(
            () => {
                notify.show('successfully register!', 'success');
                this.handleLogin(body);
            },
            (error) => {
                console.error(error);
                if (error.response.status === 409) {
                    notify.show('username already exists', 'error');
                } else {
                    notify.show('network issue!', 'error');
                }
            },
        );
    };

    handleClick = () => {
        this.setState({ ...this.state, openMenu: !this.state.openMenu });
    };
    handleLoginOpen = () => {
        this.setState({ ...this.state, loginOpen: true });
    };
    handleSendOpen = () => {
        this.setState({ ...this.state, openModal: true });
    };
    handleSendClose = () => {
        this.setState({ ...this.state, openModal: false });
    };
    handleRegisterOpen = () => {
        this.setState({ ...this.state, regisOpen: true });
    }
    asyncGetPost = () => {
        axios.get('post').then(
            (response) => {
                this.setState({ ...this.state, post: response.data });
            },
            (error) => {
                notify.show('Network issue!', 'error');
                console.error(error);
            },
        );
        setTimeout(() => {
            this.setState({ ...this.state, loading: false });
        }, 1000);
    };
    asyncSend = (msg) => {
        axios.post('make_post', { content: msg }).then(
            () => {
                notify.show('Message sent!', 'success');
                this.asyncGetPost();
            },
            (error) => {
                notify.show('Network issue!', 'error');
                console.log(error);
            },
        );
    };

    render() {
        const MenuStyle = {
            bmMenu: {
                background: '#B2DFDB',
                padding: '2.5em 0',
                fontSize: '1.15em',
                maxWidth: '300px',
            },
        };
        return (
            <div id={'outer-container'}>
                <Notifications options={{ zIndex: 5000 }} />
                <Modal
                    open={this.state.openModal}
                    onClose={this.handleSendClose}
                    style={{
                        position: 'absolute',
                        boxShadow: 'grey',
                        left: '25%',
                        width: '50%',
                        height: 400,
                    }}>
                    <div style={{ backgroundColor: 'white' }}>
                        <TextField
                            label="Message"
                            multiline
                            fullWidth
                            defaultValue={this.content}
                            onChange={(i) => {
                                this.content = i.target.value;
                            }} />
                        <Button
                            onClick={() => {
                                this.asyncSend(this.content);
                                this.handleSendClose();
                                this.content = '';
                            }}>
                            Send
                        </Button>
                    </div>
                </Modal>

                <AppBar position="sticky">
                    <Menu
                        width={'20%'}
                        styles={MenuStyle}
                        isOpen={this.state.openMenu}
                        disableOverlayClick={this.handleClick}
                        outerContainerId={'outer-container'}>
                        <div>
                            <UserInfoList name={this.state.name} />
                        </div>
                    </Menu>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                        {this.state.login ? <IconButton
                            color="inherit"
                            aria-label="Menu"
                            onClick={this.handleClick}>
                            <MenuIcon />
                        </IconButton> :
                        <div />
                        }
                        <div style={{ flex: 4, textAlign: 'center' }}> Cloud net</div>
                        <div style={{ flex: 1 }} ref={node => this.loginAnchor = node}>
                            <LoginPopOver
                                anchor={this.loginAnchor}
                                open={this.state.loginOpen}
                                asyncReq={this.handleLogin}
                                onClose={() => this.setState({ ...this.state, loginOpen: false })} />
                            <RegisPopover
                                anchor={this.loginAnchor}
                                open={this.state.regisOpen}
                                asyncReq={this.handleRegister}
                                onClose={() => this.setState({ ...this.state, regisOpen: false })} />
                            {this.state.login ? (
                                <div>
                                    <Button
                                        variant="raised"
                                        color="secondary"
                                        onClick={() => {
                                            this.state.cookies.remove('token');
                                            axios.post('/frinet/logout', {});
                                            delete axios.defaults.headers.common.Authorization;
                                            this.setState({ ...this.state, login: false });
                                            this.state.cookies.remove('name');
                                        }}>
                                        Logout
                                    </Button>
                                    <Button
                                        variant="raised"
                                        color="secondary"
                                        onClick={this.handleSendOpen}>
                                        Send
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Button
                                        variant="raised"
                                        color="secondary"
                                        onClick={this.handleLoginOpen}>
                                        Login
                                    </Button>
                                    <Button
                                        variant="raised"
                                        color="secondary"
                                        onClick={this.handleRegisterOpen}>
                                        Register
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>
                {this.state.login ? <PostList post={this.state.post} /> : <div />}
            </div>
        );
    }
}

export default hot(module)(App);
