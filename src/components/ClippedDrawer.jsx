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
// import MyListTree from "./MyListTree";


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

class ClippedDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            addUrl: ""
        };

        this.onClickAdd = this.onClickAdd.bind(this);
        this.handleChangeUrl = this.handleChangeUrl.bind(this);
    }

    onClickAdd() {
        if(this.state.addUrl.length) {
            this.setState({addUrl: ""});
        }
    }
    handleChangeUrl(e) {
        this.setState({addUrl: e.target.value});
    }

    render() {
        const { classes } = this.props;

        return <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="title" color="inherit" noWrap className={classes.flex}>
                        mjolnir
                    </Typography>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                            id="url"
                            label="URL of mylist"
                            // className={classes.textField}
                            value={this.state.addUrl}
                            onChange={this.handleChangeUrl}
                            margin="normal"
                        />
                        <IconButton color="inherit" aria-label="Add" onClick={this.onClickAdd} >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </form>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.toolbar} />
                {/*<MyListTree items={[]}/>*/}
                <Divider />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>
            </main>
        </div>
    }
}

ClippedDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClippedDrawer);

