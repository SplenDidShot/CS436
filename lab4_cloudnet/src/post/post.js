import React, { PureComponent } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

class SinglePost extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { loading: false };
    }
    render() {
        return (
            <Paper>
                {this.props.post.user}
                <Divider />
                {this.props.post.content}
            </Paper>
        );
    }
}

export default SinglePost;
