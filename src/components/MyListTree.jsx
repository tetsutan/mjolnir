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
});

@inject('root')
@observer
class MyListTree extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(index) {
        const { root } = this.props;
        root.setCurrent(index);
    }

    render() {
        const { classes, root } = this.props;
        const { mylists } = root;

        return (
            <div className={classes.listtree}>
                <List component="nav">
                    {mylists.lists.map((mylist, index) =>
                        <ListItem button onClick={() => this.handleClick(index)} key={index}>
                            <ListItemText primary={mylist.title} />
                        </ListItem>
                    )}
                </List>
                <Divider />
            </div>
        );
    }
}

export default withStyles(styles)(MyListTree);

