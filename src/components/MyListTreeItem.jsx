import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {remote} from 'electron'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import red from '@material-ui/core/colors/red';

import ClassNames from 'classnames';
import {DragSource, DropTarget} from "react-dnd";
import {isAlive} from "mobx-state-tree";

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const styles = theme => ({
    container: {

        position: 'relative'
    },
    listItem: {
        padding: 15,
    },
    active: {
        backgroundColor: theme.palette.action.selected
    },
    progress: {
        flexGrow: 1,
        position: 'absolute',
        backgroundColor: red[100],
        width: '100%',
        height: '100%',
        opacity: '0.5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressIcon: {
        width: '100%',
        height: '10px',
    },

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

        this.scrollToSection = this.scrollToSection.bind(this);
    }

    handleClick(e) {
        const { root, mylist} = this.props;
        const { movieIndex } = root;

        if(!mylist.updating) {
            movieIndex.clear();
            root.setShowing(mylist);
        }
    }

    handleDoubleClick(e) {
        const { root, mylist } = this.props;
        mylist.updateForce();
    }

    handleContextMenu(e){
        e.preventDefault();
        const { root, mylist } = this.props;
        const { mylists } = root;

        const menu = new Menu();
        menu.append(new MenuItem({
            label: 'Refresh',
            click() { mylist.updateForce() },
        }));
        menu.append(new MenuItem({type: 'separator'}));
        menu.append(new MenuItem({
            label: 'Remove',
            click() { mylists.remove(mylist.id) },
        }));
        menu.append(new MenuItem({type: 'separator'}));
        menu.append(new MenuItem({
            label: 'Mark all watched',
            click() { mylist.movies.forEach(m => m.setWatched()) },
        }));
        menu.append(new MenuItem({
            label: 'Mark all unwatched',
            click() { mylist.movies.forEach(m => m.setWatched(false)) },
        }));

        menu.popup({window: remote.getCurrentWindow()});
    }

    scrollToSection(section) {
        const { mylist } = this.props;
        // dom element
        // mylist maybe destroyed because from `ref`
        if(isAlive(mylist) && mylist.showingIndex !== -1 && mylist.showing && section) {
            section.scrollIntoView({block: "nearest"});
        }
    }

    render() {
        const { classes, mylist, isDragging, connectDragSource, connectDropTarget } = this.props;

        const className = ClassNames({
            [classes.listItem]: true,
            [classes.active]: mylist.showing,
        });

        const primaryColor = mylist.unwatchCount > 0 ? "inherit" : "textSecondary";

        const dragView = connectDragSource(connectDropTarget(
            <div>
                <ListItemText primary={mylist.title} secondary={mylist.author}
                              primaryTypographyProps={{variant: "body2", color: primaryColor}}
                              secondaryTypographyProps={{variant: "caption"}}
                />
            </div>
        ));


        const total = mylist.movies.length;
        const complete = mylist.updating ? 0 : total - mylist.updatingMovieCount;

        const progressView = total === complete ? <div /> : (<div className={classes.progress}>
                <LinearProgress className={classes.progressIcon} color="secondary" variant="determinate" value={(complete/total)*100} />
            </div>);

        return (
            <div className={classes.container}
                 ref={(section) => {
                     this.scrollToSection(section);
                 }}>
                {progressView}
                <ListItem button className={className}
                          onClick={this.handleClick}
                          onDoubleClick={this.handleDoubleClick}
                          onContextMenu={this.handleContextMenu}
                >
                    {dragView}
                </ListItem>
            </div>
        );
    }
}

export default MyListTreeItem;
