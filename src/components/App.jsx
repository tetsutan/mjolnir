
import React from "react";
// import storage from 'electron-json-storage';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron'
import { inject, observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ClippedDrawer from './ClippedDrawer'
import * as Mousetrap from 'mousetrap'

@inject('root')
@observer
class App extends React.Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        root: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const { root } = this.props;
        const { movieIndex } = root;

        Mousetrap.bind(['s'], root.moveToNextMylist);
        Mousetrap.bind(['a'], root.moveToPrevMylist);
        Mousetrap.bind(['j'], root.moveToNextMovie);
        Mousetrap.bind(['k'], root.moveToPrevMovie);
        Mousetrap.bind(['o', 'v'], (e) => {

            const movie = root.currentMovie;
            if (movie) {
                movie.setWatched();
                root.historyStore.add(movie);
                if(e.key === 'o') {
                    ipcRenderer.send("open", movie.url, true);
                }
                else {
                    ipcRenderer.send("open", movie.url);
                }
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
        Mousetrap.bind(['shift+del'], () => {
            root.deleteCurrentAll();
        });

        Mousetrap.bind(['shift+r'], root.reloadAllMylist);
        Mousetrap.bind(['shift+o', 'shift+v'], (e) => {
            if(root.isShowingMylist) {
                const mylist = root.mylists.showing;
                if(mylist) {
                    if(e.key === 'O') {
                        ipcRenderer.send("open", mylist.url, true);
                    }
                    else {
                        ipcRenderer.send("open", mylist.url);
                    }
                    root.snackMessageStore.setThenClear(`Opened [${mylist.url}]`, 3)

                }
            }
        });
        Mousetrap.bind(['l'], root.lockCurrentMylist);

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



export default App
