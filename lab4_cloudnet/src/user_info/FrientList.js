import React, { Component } from 'react';
import axios from 'axios';
import { CircularProgress } from 'material-ui/Progress';
import Notifications, { notify } from 'react-notify-toast';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, friends: [] };
    }
    componentDidMount() {
        this.asyncReqFriend('friend');
    }

    asyncReqFriend = (url) => {
        axios.get(url).then(
      (res) => {
          this.setState({ ...this.state, loading: false, friends: res.data });
      },
      (err) => {
          notify.show('fail to load friend list', 'error');
          console.error(err);
      },
    );
    };

    render() {
        return (
            <div>
                <Notifications />
                {this.state.loading ? (
                    <CircularProgress />
        ) : (
            <List>
                {this.state.friends.map(user => <div>{user.username}<Divider /></div>)}
            </List>
        )}
            </div>
        );
    }
}

export default FriendList;
