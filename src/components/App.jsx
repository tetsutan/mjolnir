
import React from "react";
// import storage from 'electron-json-storage';
import { inject, observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ClippedDrawer from './ClippedDrawer'
import * as Mousetrap from 'mousetrap'

@inject('root')
@observer
export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { root } = this.props;
        Mousetrap.bind(['s'], root.moveToNextMylist);
        Mousetrap.bind(['a'], root.moveToPrevMylist);
        Mousetrap.bind(['j'], root.moveToNextMovie);
        Mousetrap.bind(['k'], root.moveToPrevMovie);
    }

    componentWillUnmount() {
        const { root } = this.props;
        Mousetrap.unbind(['s']);
        Mousetrap.unbind(['a']);
        Mousetrap.unbind(['j']);
        Mousetrap.unbind(['k']);
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <ClippedDrawer />
            </React.Fragment>
        )

    }
}



