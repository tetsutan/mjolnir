import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {remote} from 'electron'

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import HistoryIcon from '@material-ui/icons/History';

import classNames from 'classnames';
import {isAlive} from "mobx-state-tree";

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const styles = theme => ({
    listtree: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        overflowY: "scroll",
        overflowX: "hidden",
        height: '100vh'
    },
    active: {
        backgroundColor: theme.palette.action.selected
    },
    listheader: {
        height: 80
    }
});

@inject('root')
@withStyles(styles)
@observer
class HistoryTab extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);

        this.scrollToSection = this.scrollToSection.bind(this);
    }

    handleClick(e) {
        const { root } = this.props;
        const { movieIndex } = root;
        movieIndex.clear();
        root.setShowingHistory();
    }

    handleContextMenu(e){
        e.preventDefault();
        const { root } = this.props;

        const menu = new Menu();
        menu.append(new MenuItem({
            label: 'Clear older 100',
            click() { root.historyStore.clearOlder(100) },
        }));
        menu.append(new MenuItem({
            label: 'Clear all',
            click() { root.historyStore.clear() },
        }));

        menu.popup({window: remote.getCurrentWindow()});
    }

    scrollToSection(section) {
        const { root } = this.props;
        // dom element
        if(isAlive(root) && root.isShowingHistory && section) {
            section.scrollIntoView({block: "nearest"});
        }
    }

    render() {
        const { classes, root } = this.props;
        return (
            <div
                ref={(section) => {
                    this.scrollToSection(section);
                }}>
                <ListItem button
                          onClick={this.handleClick}
                          onContextMenu={this.handleContextMenu}
                          className={classNames({
                              [classes.active]: root.isShowingHistory,
                              [classes.listheader]: true,
                          })}>
                    <HistoryIcon />
                    <ListItemText primary="History" />
                </ListItem>
            </div>
        );
    }
}

export default HistoryTab;
