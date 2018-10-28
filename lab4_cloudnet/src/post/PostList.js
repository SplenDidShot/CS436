import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import SinglePost from './post';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
    },
});

class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }
    render() {
        return (
            <div className={this.props.classes.root}>
                <List>
                    {this.props.post.map(p => (
                        <div>
                            <ListItem className={this.props.classes.item}>
                                <SinglePost post={p} />
                            </ListItem>
                        </div>
          ))}
                </List>
            </div>
        );
    }
}

PostList.propTypes = {
    classes: PropTypes.isRequired,
    post: PropTypes.arrayOf(PropTypes.object).isRequired,
};
PropTypes.defaultProps = {
    post: [],
};

export default withStyles(styles)(PostList);
