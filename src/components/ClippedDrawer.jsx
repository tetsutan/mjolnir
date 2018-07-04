import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

import { inject, observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import MyListStore from "../stores/MyListStore";
import MyListTree from "./MyListTree";
import AddingForm from "./AddingForm";
import MovieList from "./MovieList";
// import Counter from "./Counter"
import isDev from 'electron-is-dev';

const drawerWidth = "25vw";

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        height: '100vh',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    flex: {
        flex: 1,
    },
    drawerPaper: {
        position: 'relative',
        overflow: 'hidden',
        width: drawerWidth,
        height: '100vh'
    },
    content: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit,
        minWidth: 0, // So the Typography noWrap works
        height: "100vh",
    },
    toolbar: theme.mixins.toolbar

});

@inject('snackMessageStore')
@withStyles(styles)
@observer
class ClippedDrawer extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    render() {
        const { classes, snackMessageStore } = this.props;

        return <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="title" color="inherit" noWrap className={classes.flex}>
                        mjolnir
                    </Typography>
                    <AddingForm />
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.toolbar} />

                <MyListTree />
            </Drawer>
            {(() => {if(isDev) {return <DevTools />}})()}
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <MovieList />
            </main>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={!snackMessageStore.empty}
                message={snackMessageStore.message}
            />
        </div>
    }
}

export default ClippedDrawer;

