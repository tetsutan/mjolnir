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
@inject('urlStoreError')
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
        const { root, urlStoreError } = this.props;
        const { urlStore, mylists } = root;

        if(e){
            e.preventDefault();
        }

        if(urlStore.isNicoUrl) {

            const url = urlStore.url;

            if(mylists.has(url)) {
                // すでにある
                urlStoreError.set("Already in list");
                urlStoreError.clearAfter(5);
                urlStore.clear();
            } else {
                mylists.add(url);
                urlStore.clear()
            }


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
        const { root, urlStoreError, classes } = this.props;
        const { urlStore } = root;

        const err = <Typography color="error" disabled={!urlStoreError.hasError}>{urlStoreError.message}</Typography>;

        return <div>
            <TextField
                id="url"
                label="URL of mylist"
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

