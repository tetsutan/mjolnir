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
@withStyles(styles)
@observer
class AddingForm extends React.Component {

    constructor(props) {
        super(props);

        this.handleClickAddButton = this.handleClickAddButton.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.add = this.add.bind(this);
        this.addMulti = this.addMulti.bind(this);

        this.setDomTextFiled = this.setDomTextFiled.bind(this);
        this.blurTextField = this.blurTextField.bind(this);
    }

    static propTypes = {
        root: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
    };

    handleClickAddButton(e) {

        if(e){
            e.preventDefault();
        }
        this.add()

    }

    handleKeyPress(e) {
        const ENTER = 13;

        if(!e){
            return;
        }

        switch(e.which) {
            case ENTER:
                this.add();
                break;
        }
    }

    add() {

        const { root } = this.props;
        const { urlStore, mylists, singleMoviesStore, snackMessageStore } = root;

        // normalizeを使ってmylistかどうか判定
        const url = urlStore.url;

        // 複数かどうか
        if(url.includes(",")) {
            // 複数っぽいのでメッセージ出してバックグラウンドで複数追加
            if(confirm("Added url contains multiple urls?")) {
                this.addMulti(url);
                urlStore.clear();
            }
        } else if(Util.normalizeMylistOrRankingId(url)) {

            if(mylists.has(url)) {
                // すでにある
                snackMessageStore.set("Already in list");
                snackMessageStore.clearAfter(5);
                urlStore.clear();
                this.blurTextField();
            } else {
                mylists.add(url);
                snackMessageStore.set("Added");
                snackMessageStore.clearAfter(5);
                urlStore.clear();
                this.blurTextField();
            }
        } else if(Util.normalizeMovieId(url)) {
            singleMoviesStore.add(url);
            snackMessageStore.set("Added");
            snackMessageStore.clearAfter(5);
            urlStore.clear();
            this.blurTextField();
        }
    }

    addMulti(input) {
        const {root} = this.props;
        const {mylists, movieListStore, singleMoviesStore} = root;

        const urls = input.split(',');

        const checkUpdate = (item, next) => () => {
            if(item.updating) {
                setTimeout(checkUpdate(item, next), 200);
            } else {
                next()
            }
        };


        const _add = (i) => () => {

            if(i < urls.length) {
                const _url = urls[i];
                if(_url) {

                    let item = null;
                    if(Util.normalizeMylistOrRankingId(_url)) {
                        mylists.add(_url);
                        item = mylists.get(_url);
                    } else if(Util.normalizeMovieId(_url)) {
                        singleMoviesStore.add(_url);
                        item = movieListStore.get(_url)
                    }

                    if(item){
                        checkUpdate(item, () => {
                            root.snackMessageStore.setThenClear(`Added [${item.id}]`, 3);
                            setTimeout(_add(i+1), 100);
                        })();
                    } else {
                        setTimeout(_add(i+1), 100);
                    }

                } else {
                    setTimeout(_add(i+1), 100);
                }
            }
            else {
                // complete
                root.snackMessageStore.setThenClear("Multi url added", 3);
            }

        };

        _add(0)();
    }

    setDomTextFiled(section) {
        this.domTextField = section;
    }

    blurTextField() {
        if(this.domTextField) {
            this.domTextField.blur();
        }
    }


    render() {
        const { root, classes } = this.props;
        const { urlStore } = root;

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
                inputRef={(section) => {
                    this.setDomTextFiled(section);
                }}
            />
            <IconButton color="inherit" aria-label="Add" onClick={this.handleClickAddButton} >
                <AddCircleOutlineIcon />
            </IconButton>

        </div>
    }
}

export default AddingForm
