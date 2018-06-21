import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import TextField from '@material-ui/core/TextField';
import { inject, observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import MyListStore from "../stores/MyListStore";
import MyListTree from "./MyListTree";
import AddingForm from "./AddingForm";
// import Counter from "./Counter"

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    flex: {
        flex: 1,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
});

@observer
class ClippedDrawer extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    render() {
        const { classes } = this.props;

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
                <Divider />
            </Drawer>
            <DevTools />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Typography noWrap>{'main'}</Typography>
            </main>
        </div>
    }
}

export default withStyles(styles)(ClippedDrawer);

