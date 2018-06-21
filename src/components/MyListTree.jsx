import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';




const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        overflow: "scroll",
    },
});

@inject('mylists')
@observer
class MyListTree extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        mylists: PropTypes.object.isRequired,
    };

    render() {
        const { classes, mylists } = this.props;

        return (
            <div className={classes.root}>
                <List component="nav">
                    {mylists.lists.map(mylist =>
                        <ListItem button>
                            <ListItemText primary={mylist.url} />
                        </ListItem>
                    )}
                </List>
                <Divider />
            </div>
        );
    }
}

export default withStyles(styles)(MyListTree);

