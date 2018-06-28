import React from "react";
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import Util from "../Util";

const styles = theme => ({
    addingForm: {
        width: "300px"
    },
});

@inject('root')
@inject('urlMessageStore')
@withStyles(styles)
@observer
export default class AddingForm extends React.Component {

    constructor(props) {
        super(props);

        this.handleClickAddButton = this.handleClickAddButton.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    static propTypes = {
        root: PropTypes.object.isRequired,
    };

    handleClickAddButton(e) {
        const { root, urlMessageStore } = this.props;
        const { urlStore, mylists, movieListStore, singleMoviesStore } = root;

        if(e){
            e.preventDefault();
        }

        // normalizeを使ってmylistかどうか判定
        const url = urlStore.url;
        if(Util.normalizeMylistId(url)) {

            if(mylists.has(url)) {
                // すでにある
                urlMessageStore.set("Already in list");
                urlMessageStore.clearAfter(5);
                urlStore.clear();
            } else {
                mylists.add(url, movieListStore);
                urlMessageStore.set("Added");
                urlMessageStore.clearAfter(5);
                urlStore.clear()
            }
        } else if(Util.normalizeMovieId(url)) {
            singleMoviesStore.add(url, movieListStore);
            urlMessageStore.set("Added");
            urlMessageStore.clearAfter(5);
            urlStore.clear();
        }
    }

    handleKeyPress(e) {
        const ENTER = 13;

        switch(e.which) {
            case ENTER:
                e.preventDefault();
                this.handleClickAddButton();
                break;
        }
    }


    render() {
        const { root, urlMessageStore, classes } = this.props;
        const { urlStore } = root;

        let err = <div />;
        if (!urlMessageStore.empty) {
            err = <Typography color="error">{urlMessageStore.message}</Typography>
        }

        return <div>
            <TextField
                id="url"
                label="URL/id of movie/mylist"
                value={urlStore.url}
                error={urlStore.hasError}
                onChange={urlStore.handleChange}
                onKeyPress={this.handleKeyPress}
                margin="normal"
                className={classes.addingForm}
                fullWidth={true}

            />
            <IconButton color="inherit" aria-label="Add" onClick={this.handleClickAddButton} >
                <AddCircleOutlineIcon />
            </IconButton>
            {err}

        </div>
    }
}

