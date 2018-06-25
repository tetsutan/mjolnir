import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';




const styles = theme => ({
    listtree: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        overflow: "scroll",
    },
    active: {
        backgroundColor: theme.palette.action.selected
    }
});

@inject('root')
@inject('movieIndex')
@observer
class MyListTree extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleClick(id) {
        const { root, movieIndex } = this.props;
        movieIndex.clear();
        root.setShowing(id);
    }

    handleDoubleClick(mylist) {
        mylist.update();
    }

    render() {
        const { classes, root } = this.props;
        const { mylists } = root;

        const items = [];
        mylists.lists.forEach(mylist => {
            const className = root.showing === mylist.id ? classes.active : "";
            items.push(
                <ListItem button key={mylist.id} className={className}
                          onClick={() => this.handleClick(mylist.id)}
                          onDoubleClick={() => this.handleDoubleClick(mylist)}
                >
                    <ListItemText primary={mylist.title} />
                </ListItem>
            )
        });

        return (
            <div className={classes.listtree}>
                <List component="nav">
                    {items}
                </List>
                <Divider />
            </div>
        );
    }
}

export default withStyles(styles)(MyListTree);

