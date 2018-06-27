import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CachedIcon from '@material-ui/icons/Cached';
import {DragDropContext} from "react-dnd";
import HTML5Backend from 'react-dnd-html5-backend';

import MyListTreeItem from "./MyListTreeItem";



const styles = theme => ({
    listtree: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        overflowY: "scroll",
        overflowX: "hidden",
        height: '100vh'
    },
});

@inject('root')
@DragDropContext(HTML5Backend)
@observer
class MyListTree extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleReloadClick = this.handleReloadClick.bind(this);
    }

    handleReloadClick() {
        const { classes, root } = this.props;
        const { mylists } = root;

        mylists.reverse.forEach(mylist => {
            mylist.update();
        });

    }

    render() {
        const { classes, root } = this.props;
        const { mylists } = root;

        const items = [];
        mylists.reverse.forEach(mylist => items.push(<MyListTreeItem key={mylist.id} mylist={mylist} />));

        return (
            <div className={classes.listtree}>
                <List component="nav">
                    <ListItem>
                        <ListItemText primary="My List" />
                        <IconButton className={classes.button} aria-label="reload" onClick={this.handleReloadClick}>
                            <CachedIcon />
                        </IconButton>
                    </ListItem>
                    <Divider />
                    {items}
                </List>
                <Divider />
            </div>
        );
    }
}

export default withStyles(styles)(MyListTree);

