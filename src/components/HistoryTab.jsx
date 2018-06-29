import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import HistoryIcon from '@material-ui/icons/History';

import classNames from 'classnames';


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
    }

    handleClick(e) {
        const { root } = this.props;
        const { movieIndex } = root;
        movieIndex.clear();
        root.setShowingHistory();
    }

    render() {
        const { classes, root } = this.props;
        return (
            <ListItem button onClick={this.handleClick} className={classNames({
                [classes.active]: root.isShowingHistory,
                [classes.listheader]: true,
            })}>
                <HistoryIcon />
                <ListItemText primary="History" />
            </ListItem>
        );
    }
}

export default HistoryTab;
