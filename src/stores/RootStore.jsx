import {types} from "mobx-state-tree";
import {dialog} from 'electron';
import MyListsStore from "./MyListsStore";
import MyListStore from "./MyListStore";
import UrlStore from "./UrlStore";
import IndexStore from "./IndexStore";
import Util from "../Util";
import HistoryStore from "./HistoryStore";
import MovieListStore from "./MovieListStore";
import SingleMoviesStore from "./SingleMoviesStore";
import ContextStore from "./ContextStore";
import MessageStore from "./MessageStore";


const RootStore = types.model({
    showType: Util.ShowType.MYLIST,
    mylists: MyListsStore,
    urlStore: UrlStore,
    historyStore: HistoryStore,
    movieListStore: MovieListStore,
    singleMoviesStore: SingleMoviesStore,
    movieIndex: IndexStore,
    contextStore: ContextStore,
    snackMessageStore: MessageStore,

}).volatile(self => ({
    prevShowingId: "",
    prevShowType: "",
})).views(self => ({

    get isShowingMylist() {
        return self.showType === Util.ShowType.MYLIST;
    },
    get isShowingHistory() {
        return self.showType === Util.ShowType.HISTORY;
    },
    get isShowingMovie() {
        return self.showType === Util.ShowType.MOVIE;
    },

    get currentMovies() {

        if(self.isShowingHistory) {
            return self.historyStore.movies.slice().reverse();
        }
        else if(self.isShowingMovie) {
            return self.singleMoviesStore.movies.slice().reverse();
        } else {
            if(self.mylists.showing) {
                return self.mylists.currentMovies;
            }
        }

        return [];

    },

    // first call: limited(5) movies
    // second call: all movies
    // with action of setLimitTimer and react:ref
    get currentLimitedMovies() {

        if(self.isShowLimitedMovies) {
            return self.currentMovies.slice(0, 5);
        }
        return self.currentMovies;

    },

    get isShowLimitedMovies() {
        if(self.showType !== self.prevShowType) {
            return true;
        } else {
            if(self.isShowingMylist && self.mylists.showing) {
                if(!self.prevShowingId || self.prevShowingId !== self.mylists.showing.id) {
                    return true;
                }
            }
        }

        return false;
    },

    get currentMovie() {
        return self.currentMovies[self.movieIndex.index];
    },

    get moviesSize() {

        if(self.mylists.showing && self.showType === Util.ShowType.MYLIST) {
            return self.mylists.showing.movies.length;
        } else {
            if(self.showType === Util.ShowType.HISTORY) {
                return self.historyStore.movies.length;
            } else if(self.showType === Util.ShowType.MOVIE) {
                return self.singleMoviesStore.movies.length;
            }
        }
        return 0;
    }

})).actions(self => {

    let currentLimitTimer = null;

    function setShowing(mylist) {
        self.showType = Util.ShowType.MYLIST;
        self.mylists.setShowing(mylist)
    }
    function setShowingHistory() {
        self.showType = Util.ShowType.HISTORY;
        self.mylists.clearShowingIndex();
    }
    function setShowingMovie() {
        self.showType = Util.ShowType.MOVIE;
        self.mylists.clearShowingIndex();
    }

    function moveToNextMylist(e) {
        self.mylists.moveToMylistIndex(-1);
        self.showType = Util.ShowType.MYLIST;
        self.movieIndex.clear();
    }
    function moveToPrevMylist(e) {
        self.mylists.moveToMylistIndex(1);
        self.movieIndex.clear();
        self.showType = Util.ShowType.MYLIST;
    }
    function moveToFirstMylist(e) {
        self.mylists.positionToMylistIndex(0);
        self.movieIndex.clear();
        self.showType = Util.ShowType.MYLIST;
    }
    function moveToLastMylist(e) {
        self.mylists.positionToMylistIndex(self.mylists.length-1);
        self.movieIndex.clear();
        self.showType = Util.ShowType.MYLIST;
    }

    function moveToNextMovie(e) {
        self.moveToMovie(1)
    }
    function moveToPrevMovie(e) {
        self.moveToMovie(-1)
    }
    function moveToFirstMovie(e) {
        self.movieIndex.set(0);
    }
    function moveToLastMovie(e) {
        const maxIndex = self.moviesSize -1;
        self.movieIndex.set(maxIndex);
    }

    function moveToMovie(offset) {

        const currentIndex = self.movieIndex.index;
        let nextIndex = currentIndex + offset;
        if(nextIndex < 0) { nextIndex = 0; }

        const maxIndex = self.moviesSize -1;

        if(maxIndex < nextIndex) { nextIndex = maxIndex; }
        self.movieIndex.set(nextIndex);

    }

    function toggleWatchedForCurrent() {
        const movie = self.currentMovie;
        if(movie) {
            movie.toggleWatched()
        }
    }

    function reloadCurrentMylist() {

        if (self.mylists.showingIndex !== -1) {
            const current = self.mylists.showing;
            if (current) {
                current.updateForce()
            }
        }
    }

    function reloadAllMylist() {

        self.mylists.items.forEach(mylist => {
            mylist.updateForce();
        });
    }

    function deleteCurrent() {

        if (self.mylists.showingIndex !== -1) {
            const current = self.mylists.showing;
            if(current) {
                if(confirm("delete? [id: "+current.id+", title: "+current.title+"]")) {
                    self.mylists.remove(current.id)
                }
            }
        } else {
            if(self.isShowingHistory) {
                const current = self.historyStore.get(self.movieIndex.index);
                if(current && confirm("delete? [id: "+current.id+", title: "+current.title+"]")) {
                    self.historyStore.removeFromIndex(self.movieIndex.index);
                }

            }
            else if(self.isShowingMovie) {
                const current = self.singleMoviesStore.get(self.movieIndex.index);
                if(current && confirm("delete? [id: "+current.id+", title: "+current.title+"]")) {
                    self.singleMoviesStore.removeFromIndex(self.movieIndex.index);
                }
            }
        }

    }

    function deleteCurrentAll() {

        if(self.isShowingHistory) {
            if(confirm("delete all?")) {
                self.historyStore.clear();
            }

        }
        else if(self.isShowingMovie) {
            if(confirm("delete all?")) {
                self.singleMoviesStore.clear();
            }
        }

    }

    function addMovieToSingleMovies(movie) {
        if(movie) {
            self.singleMoviesStore.addExistsMovie(movie);
            self.snackMessageStore.setThenClear(`Add to Watch later [${movie.id}]`, 3)
        }

    }
    function addCurrentMovieToSingleMovies() {
        const movie = self.currentMovie;
        addMovieToSingleMovies(movie);
    }

    function lockCurrentMylist() {
        const mylist = self.mylists.showing;
        const current = mylist.locked;

        if(self.isShowingMylist && mylist) {
            self.mylists.clearShowingIndex();
            mylist.setLocked(!current);
            if(!current) {
                self.mylists.moveToFirst(mylist);
            }
            self.mylists.setShowing(mylist)
        }

    }

    function setLimitTimer(time) {
        if(currentLimitTimer != null) {
            clearTimeout(currentLimitTimer);
        }

        if(!self.isShowLimitedMovies) {
            return;
        }
        // if(self.mylists.showing && self.prevShowingId === self.mylists.showing.id) {
        //     return;
        // }

        currentLimitTimer = setTimeout(self.changePrev, time);
    }

    function changePrev() {
        self.prevShowType = self.showType;
        if(self.mylists.showing) {
            self.prevShowingId = self.mylists.showing.id;
        }
    }

    return {setShowing, setShowingHistory, setShowingMovie,
        moveToNextMylist, moveToPrevMylist,
        moveToFirstMylist, moveToLastMylist,
        moveToMovie, moveToNextMovie, moveToPrevMovie,
        moveToFirstMovie, moveToLastMovie,
        toggleWatchedForCurrent, reloadCurrentMylist, reloadAllMylist,
        deleteCurrent, deleteCurrentAll,
        addCurrentMovieToSingleMovies, addMovieToSingleMovies,
        lockCurrentMylist,
        setLimitTimer, changePrev,
    }
});

export default RootStore;
