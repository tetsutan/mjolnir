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
    list: {
        padding: 0,
        flex: 'auto',
        overflowY: "scroll",
        overflowX: "hidden",
    },
    listItem: {
        padding: theme.spacing.unit
    },
    card: {
        display: 'flex',
        justifyContent: "left",
        alignItems: "start",
        width: '100%',

    },
    cardSelected: {
        backgroundColor: theme.palette.action.selected,
    },
    cover: {
        // 元画像が130x100
        // minWidth: 200,
        minWidth: 200,
        width: 200,
        height: 150,
    },
    details: {
        // overflowWrap: 'break-word',
        wordBreak: 'break-all',
        flexDirection: 'column',
        flex: 1,
    },
    content: {
        height: '100%',
        width: '100%',
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
    dateList: {
        marginTop: 20,
        display: 'flex'
    },
    date: {
        paddingRight: theme.spacing.unit

    },



});


@inject('root')
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
        this.watchedColor = this.watchedColor.bind(this);

        this.scrollToSection = this.scrollToSection.bind(this);
    }

    handleClick(e, index) {
        const { root } = this.props;
        const { movieIndex } = root;
        movieIndex.set(index);
    }

    handleDoubleClick(e, index) {
        e.preventDefault();
        e.stopPropagation();

        const { classes, root } = this.props;
        const { mylists, historyStore } = root;

        const movies = root.currentMovies;

        const movie = movies.get(index);
        if (movie) {
            movie.setWatched();
            historyStore.add(movie);
            ipcRenderer.send("open", movie.url);
        }

    }

    scrollToSection(section) {
        // dom element
        if(section) {
            section.scrollIntoView({block: "nearest"});
        }
    }

    watchedColor(movie) {
        if(movie.watched) {
            return "textSecondary";
        }
        return "primary";

    }

    render() {
        const { classes, root } = this.props;
        const { movieIndex } = root;

        const movies = root.currentMovies;


        return (
            <div className={classes.list}>
                <List component="nav" >

                    {movies.map((movie,index) =>
                        // ref's element does not return with wrapped content (e.g. withStyles)
                        <div key={index}
                             ref={(section) => {
                                 if(movieIndex.is(index)){
                                     this.scrollToSection(section);
                                 }
                             }}>
                            <ListItem
                                className={classes.listItem}
                                onDoubleClick={e => this.handleDoubleClick(e, index)}
                                onClick={e => this.handleClick(e, index)}>

                                <Card className={classNames({
                                    [classes.card]: true,
                                    [classes.cardSelected]: movieIndex.is(index),
                                })} >
                                    {movie.thumbnailUrl ? <CardMedia
                                            className={classes.cover}
                                            image={movie.thumbnailUrl}
                                        /> : <div className={classes.cover} />
                                    }
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
                                            <div className={classes.dateList} >
                                                <Typography className={classes.date} variant="caption" color="textSecondary">{movie.length}</Typography>
                                                <Typography className={classes.date} variant="caption" color="textSecondary">-</Typography>
                                                <Typography className={classes.date} variant="caption" color="textSecondary">{movie.date}</Typography>
                                            </div>

                                        </CardContent>
                                    </div>
                                </Card>
                            </ListItem>
                        </div>
                    )}
                </List>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MovieList);


