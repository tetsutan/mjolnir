import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ClassNames from 'classnames';



const styles = theme => ({
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
@withStyles(styles)
class MyListTreeItem extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
        mylist: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleClick(e) {
        const { root, movieIndex, mylist} = this.props;
        movieIndex.clear();
        root.setShowing(mylist.id);
    }

    handleDoubleClick(e) {
        const { mylist } = this.props;
        mylist.update();
    }


    render() {
        const { classes, root, mylist } = this.props;

        const className = ClassNames({
            [classes.listItem]: true,
            [classes.active]: root.showing === mylist.id,
        });

        const updateView = mylist.updating ? <div>updating</div> : "";
        const primaryColor = mylist.unwatchCount > 0 ? "inherit" : "textSecondary";

        return (
            <ListItem button className={className}
                      onClick={this.handleClick}
                      onDoubleClick={this.handleDoubleClick}
            >
                <ListItemText primary={mylist.title} secondary={mylist.author}
                              primaryTypographyProps={{variant: "body2", color: primaryColor}}
                              secondaryTypographyProps={{variant: "caption"}}
                />
                {updateView}
            </ListItem>
        );
    }
}

export default MyListTreeItem;
