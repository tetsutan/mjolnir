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

}).views(self => ({
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
                return self.mylists.showing.movies;
            }
        }

        return [];

    },

    get currentMovie() {
        return self.currentMovies.get(self.movieIndex.index);
    },

})).actions(self => {
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
        self.mylists.positionToMylist(-1);
        self.showType = Util.ShowType.MYLIST;
        self.movieIndex.clear();
    }
    function moveToPrevMylist(e) {
        self.mylists.positionToMylist(1);
        self.movieIndex.clear();
        self.showType = Util.ShowType.MYLIST;
    }

    function moveToNextMovie(e) {
        self.moveToMovie(1)
    }
    function moveToPrevMovie(e) {
        self.moveToMovie(-1)
    }

    function moveToMovie(offset) {


        const currentIndex = self.movieIndex.index;
        let nextIndex = currentIndex + offset;
        if(nextIndex < 0) { nextIndex = 0; }

        let maxIndex = 0;
        if(self.mylists.showing && self.showType === Util.ShowType.MYLIST) {
            maxIndex = self.mylists.showing.movies.length-1
        } else {
            if(self.showType === Util.ShowType.HISTORY) {
                maxIndex = self.historyStore.movies.length -1
            } else if(self.showType === Util.ShowType.MOVIE) {
                maxIndex = self.singleMoviesStore.movies.length -1
            }
        }

        if(maxIndex < nextIndex) { nextIndex = maxIndex; }
        self.movieIndex.set(nextIndex);

    }

    function toggleWatchedForCurrent() {
        const movie =self.currentMovie;
        if(movie) {
            movie.toggleWatched()
        }
    }

    function reloadCurrentMylist() {

        if (self.mylists.showingIndex !== -1) {
            const current = self.mylists.showing;
            if (current) {
                current.updateForce(self.movieListStore)
            }
        }
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

    return {setShowing, setShowingHistory, setShowingMovie,
        moveToNextMylist, moveToPrevMylist,
        moveToMovie, moveToNextMovie, moveToPrevMovie,
        toggleWatchedForCurrent, reloadCurrentMylist,
        deleteCurrent,
        addCurrentMovieToSingleMovies, addMovieToSingleMovies
    }
});

export default RootStore;
