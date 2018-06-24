import React from "react";
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

@inject('mylists')
@inject('addingUrl')
@observer
export default class AddingForm extends React.Component {

    constructor(props) {
        super(props);

        this.handleClickAddButton = this.handleClickAddButton.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    static propTypes = {
        mylists: PropTypes.object.isRequired,
        addingUrl: PropTypes.object.isRequired,
    };

    handleClickAddButton() {
        const { addingUrl, mylists } = this.props;

        if(addingUrl.isNicoUrl) {
            mylists.add(addingUrl.url);
            addingUrl.clear()
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
        const { addingUrl } = this.props;

        return <form noValidate autoComplete="off">
            <TextField
                id="url"
                label="URL of mylist"
                value={addingUrl.url}
                error={addingUrl.hasError}
                onChange={addingUrl.handleChange}
                onKeyPress={this.handleKeyPress}
                margin="normal"
            />
            <IconButton color="inherit" aria-label="Add" onClick={this.handleClickAddButton} >
                <AddCircleOutlineIcon />
            </IconButton>
        </form>
    }
}

