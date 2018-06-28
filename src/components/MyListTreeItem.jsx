import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {remote} from 'electron'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ClassNames from 'classnames';
import {DragSource, DropTarget} from "react-dnd";

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const styles = theme => ({
    listItem: {
        padding: 15,
    },
    active: {
        backgroundColor: theme.palette.action.selected
    }
});

const sourceSpec = {
    beginDrag(props) {
        return {
            id: props.mylist.id
        }
    },
    endDrag(props, monitor) {

        const source = monitor.getItem();
        // dropSpecのdropで返されたidを取ってくる
        const target = monitor.getDropResult();
        // dropActionを発火させる
        if (target) {
            props.root.mylists.moveTo(source.id, target.id);
            // props.dropAction(source.index, target.index);
        }

    },
};

const targetSpec = {
    // dropされたときの処理
    drop(props, monitor, component) {
        // dropされたら自分のidを返す
        return {
            id: props.mylist.id
        }
    }
}

@inject('root')
@inject('movieIndex')
@DragSource('ItemTypes.MyListTreeItem', sourceSpec, (connect) => ({
    connectDragSource: connect.dragSource(),
}))
@DropTarget('ItemTypes.MyListTreeItem', targetSpec, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))
@withStyles(styles) // withStyles must be before observer
@observer
class MyListTreeItem extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
        mylist: PropTypes.object.isRequired,

        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    handleClick(e) {
        const { root, movieIndex, mylist} = this.props;
        movieIndex.clear();
        root.setShowing(mylist);
    }

    handleDoubleClick(e) {
        const { mylist } = this.props;
        mylist.update();
    }

    handleContextMenu(e){
        e.preventDefault();
        const { root, mylist } = this.props;
        const { mylists } = root;

        const menu = new Menu();
        menu.append(new MenuItem({
            label: 'Remove',
            click() { mylists.remove(mylist.id) },
        }));
        menu.append(new MenuItem({type: 'separator'}));
        menu.append(new MenuItem({
            label: 'Refresh',
            click() { mylist.update() },
        }));

        menu.popup({window: remote.getCurrentWindow()});
    }


    render() {
        const { classes, root, mylist, isDragging, connectDragSource, connectDropTarget } = this.props;

        const className = ClassNames({
            [classes.listItem]: true,
            [classes.active]: root.showing && root.showing.id === mylist.id,
        });

        const updateView = mylist.updating ? <div>updating</div> : "";
        const primaryColor = mylist.unwatchCount > 0 ? "inherit" : "textSecondary";

        const dragView = connectDragSource(connectDropTarget(
            <div>
                <ListItemText primary={mylist.title} secondary={mylist.author}
                              primaryTypographyProps={{variant: "body2", color: primaryColor}}
                              secondaryTypographyProps={{variant: "caption"}}
                />
            </div>
        ));

        return (
            <ListItem button className={className}
                      onClick={this.handleClick}
                      onDoubleClick={this.handleDoubleClick}
                      onContextMenu={this.handleContextMenu}
            >
                {dragView}
                {updateView}
            </ListItem>
        );
    }
}

export default MyListTreeItem;
