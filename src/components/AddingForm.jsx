import React from "react";
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

@inject('root')
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

    handleClickAddButton() {
        const { root } = this.props;
        const { urlStore, mylists } = root;

        if(urlStore.isNicoUrl) {
            mylists.add(urlStore.url);
            urlStore.clear()
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
        const { root } = this.props;
        const { urlStore } = root;

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
        </form>
    }
}

