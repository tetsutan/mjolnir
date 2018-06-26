import React, { Component } from 'react';
import { ipcRenderer } from 'electron'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

import classNames from 'classnames';
import Avatar from "@material-ui/core/Avatar";


const styles = theme => ({
    card: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
    },
    cardSelected: {
        backgroundColor: theme.palette.action.selected,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        minWidth: 200,
        width: 200,
        height: 120,
    },
    list: {
    },
    author: {
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
    },

    smallAvatar: {
        margin: 5,
        width: 20,
        height: 20,
    },


});


@inject('root')
@inject('movieIndex')
@observer
class MovieList extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        root: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.selectedClassNames = this.selectedClassNames.bind(this);
        this.watchedColor = this.watchedColor.bind(this);
    }

    handleClick(e, index) {
        const { movieIndex } = this.props;
        movieIndex.set(index);
    }

    handleDoubleClick(e, index) {
        e.preventDefault();

        const { classes, root } = this.props;
        const { mylists } = root;
        if(!root.showing) {
            return
        }

        const current = mylists.lists.get(root.showing);

        if(current) {
            const movie = current.movies.get(index);
            if (movie) {
                movie.setWatched();
                ipcRenderer.send("open", movie.url);
            }
        }


    }

    selectedClassNames(index) {
        const { classes, movieIndex } = this.props;

        if(index === movieIndex.index) {
            return classNames({
                [classes.card]: true,
                [classes.cardSelected]: true,
            });
        }

        return classNames({
            [classes.card]: true,
        });

    }

    watchedColor(movie) {
        if(movie.watched) {
            return "textSecondary";
        }
        return "primary";

    }

    render() {
        const { classes, root, movieIndex } = this.props;
        const { mylists } = root;
        if(!root.showing) {
            return <div>none</div>
        }

        const current = mylists.lists.get(root.showing);

        if(!current) {
            return <div />
        }

        return (
            <div>
                <List component="nav" className={classes.list}>

                    {current.movies.map((movie,index) =>
                        <ListItem key={index}
                                  onDoubleClick={e => this.handleDoubleClick(e, index)}
                                  onClick={e => this.handleClick(e, index)}>
                            <Card className={this.selectedClassNames(index)} >
                                <CardMedia
                                    className={classes.cover}
                                    image={movie.thumbnailUrl}
                                />
                                <div className={classes.details}>
                                    <CardContent className={classes.content}>
                                        <Typography variant="body2" color={this.watchedColor(movie)}>{movie.title}</Typography>
                                        <div className={classes.author}>
                                            <Avatar
                                                alt={movie.userName}
                                                src={movie.userIcon}
                                                className={classes.smallAvatar}
                                            />
                                            <Typography variant="body1" color="textSecondary">{movie.userName}</Typography>
                                        </div>
                                        <Typography variant="caption" color="textSecondary">{movie.description}</Typography>
                                    </CardContent>
                                </div>
                            </Card>
                        </ListItem>
                    )}
                </List>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MovieList);


