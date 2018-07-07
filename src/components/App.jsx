
import React from "react";
// import storage from 'electron-json-storage';
import { ipcRenderer } from 'electron'
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
        const { movieIndex } = root;

        Mousetrap.bind(['s'], root.moveToNextMylist);
        Mousetrap.bind(['a'], root.moveToPrevMylist);
        Mousetrap.bind(['j'], root.moveToNextMovie);
        Mousetrap.bind(['k'], root.moveToPrevMovie);
        Mousetrap.bind(['o'], () => {

            const movie = root.currentMovie;
            if (movie) {
                movie.setWatched();
                root.historyStore.add(movie);
                // ipcRenderer.send("open", movie.url);
                ipcRenderer.send("openBackground", movie.url);
                root.snackMessageStore.setThenClear(`Opened [${movie.url}]`, 3)
            }

        });
        Mousetrap.bind(['w'], root.toggleWatchedForCurrent);
        Mousetrap.bind(['r'], root.reloadCurrentMylist);
        Mousetrap.bind(['del'], root.deleteCurrent);
        Mousetrap.bind(['p'], root.addCurrentMovieToSingleMovies);
        Mousetrap.bind(['g g'], root.moveToFirstMovie);
        Mousetrap.bind(['shift+g'], root.moveToLastMovie);
        Mousetrap.bind(['g m'], root.moveToFirstMylist);
        Mousetrap.bind(['shift+m'], root.moveToLastMylist);
        Mousetrap.bind(['g l'], () => {
            movieIndex.clear();
            root.setShowingMovie();

        });
        Mousetrap.bind(['g h'], () => {
            movieIndex.clear();
            root.setShowingHistory();
        });
    }

    componentWillUnmount() {
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



