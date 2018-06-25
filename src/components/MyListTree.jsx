import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListIcon from '@material-ui/icons/List';
import CachedIcon from '@material-ui/icons/Cached';

import ClassNames from 'classnames';



const styles = theme => ({
    listtree: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        overflow: "scroll",
    },
    listItem: {
        padding: 15,
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
        this.handleReloadClick = this.handleReloadClick.bind(this);
    }

    handleClick(id) {
        const { root, movieIndex } = this.props;
        movieIndex.clear();
        root.setShowing(id);
    }

    handleReloadClick() {
        const { classes, root } = this.props;
        const { mylists } = root;

        mylists.lists.forEach(mylist => {
            mylist.update();
        });

    }

    render() {
        const { classes, root } = this.props;
        const { mylists } = root;

        const items = [];
        mylists.lists.forEach(mylist => {

            const className = ClassNames({
                [classes.listItem]: true,
                [classes.active]: root.showing === mylist.id,
            });

            const updateView = mylist.updating ? <div>updating</div> : "";

            items.push(
                <ListItem button key={mylist.id} className={className}
                          onClick={() => this.handleClick(mylist.id)}
                          onDoubleClick={() => mylists.update()}
                >
                    <ListItemText primary={mylist.title} secondary={mylist.author}
                                  primaryTypographyProps={{variant: "body2", color: "inherit"}}
                                  secondaryTypographyProps={{variant: "caption"}}
                    />
                    {updateView}
                </ListItem>
            )
        });

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

