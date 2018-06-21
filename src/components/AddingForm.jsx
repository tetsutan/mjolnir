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

        this.onClickAddButton = this.onClickAddButton.bind(this)
    }

    static propTypes = {
        mylists: PropTypes.object.isRequired,
        addingUrl: PropTypes.object.isRequired,
    };

    onClickAddButton() {
        const { addingUrl, mylists } = this.props;

        if(addingUrl.isNicoUrl) {
            mylists.add(addingUrl.url);
            addingUrl.clear()
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
                onChange={addingUrl.onChange}
                margin="normal"
            />
            <IconButton color="inherit" aria-label="Add" onClick={this.onClickAddButton} >
                <AddCircleOutlineIcon />
            </IconButton>
        </form>
    }
}

