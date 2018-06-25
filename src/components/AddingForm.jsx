import React from "react";
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import Util from "../Util";

@inject('root')
@inject('urlStoreError')
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
            const mylistNumber = Util.getMyListNumberFromUrl(url);

            if(mylists.lists.get(mylistNumber)) {
                // すでにある
                urlStoreError.set("Already in list");
                urlStoreError.clearAfter(5);
                urlStore.clear();
            } else {
                mylists.add(mylistNumber);
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
        const { root, urlStoreError } = this.props;
        const { urlStore } = root;

        const err = <Typography color="error" disabled={!urlStoreError.hasError}>{urlStoreError.message}</Typography>;

        return <form noValidate autoComplete="off">
            <TextField
                id="url"
                label="URL of mylist"
                value={urlStore.url}
                error={urlStore.hasError}
                onChange={urlStore.handleChange}
                onKeyPress={this.handleKeyPress}
                margin="normal"
            />
            <IconButton color="inherit" aria-label="Add" onClick={this.handleClickAddButton} >
                <AddCircleOutlineIcon />
            </IconButton>
            {err}
        </form>
    }
}

