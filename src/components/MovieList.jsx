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

const styles = theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        minWidth: 160,
        width: 320,
        height: 180,
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
    }

    handleDoubleClick(index) {

        const { classes, root } = this.props;
        const { mylists } = root;
        if(root.showing < 0) {
            return
        }

        const current = mylists.lists.get(root.showing);
        const movie = current.movies.get(index);

        if (movie) {
            ipcRenderer.send("open", movie.url);
        }


    }

    render() {
        const { classes, root } = this.props;
        const { mylists } = root;
        if(root.showing < 0) {
            return <div>none</div>
        }

        const current = mylists.lists.get(root.showing);
        return (
            <div>
                <List component="nav">

                    {current.movies.map((movie,index) =>
                        <Card className={classes.card} key={index} onDoubleClick={() => this.handleDoubleClick(index)}>
                            <CardMedia
                                className={classes.cover}
                                image={movie.thumbnailUrl}
                            />
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography variant="title">{movie.title}</Typography>
                                    <Typography variant="subheading" color="textSecondary">{movie.userName}</Typography>
                                    <Typography variant="caption" color="textSecondary">{movie.description}</Typography>
                                </CardContent>
                            </div>
                        </Card>


                    )}
                </List>
                <Divider />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MovieList);


