import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MovieIcon from '@material-ui/icons/Movie';

import classNames from 'classnames';
import {isAlive} from "mobx-state-tree";


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
class SingleMoviesTab extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        this.scrollToSection = this.scrollToSection.bind(this);
    }

    handleClick(e) {
        const { root } = this.props;
        const { movieIndex } = root;
        movieIndex.clear();
        root.setShowingMovie();
    }

    scrollToSection(section) {
        const { root } = this.props;
        // dom element
        if(isAlive(root) && root.isShowingMovie && section) {
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
                <ListItem button onClick={this.handleClick} className={classNames({
                    [classes.active]: root.isShowingMovie,
                    [classes.listheader]: true,
                })}>
                    <MovieIcon />
                    <ListItemText primary="Watch later" />
                </ListItem>
            </div>
        );
    }
}

export default SingleMoviesTab;
