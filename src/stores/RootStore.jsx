import {types} from "mobx-state-tree"
import MyListsStore from "./MyListsStore";
import MyListStore from "./MyListStore";
import UrlStore from "./UrlStore";
import IndexStore from "./IndexStore";
import Util from "../Util";
import HistoryStore from "./HistoryStore";
import MovieListStore from "./MovieListStore";
import SingleMoviesStore from "./SingleMoviesStore";
import ContextStore from "./ContextStore";


const RootStore = types.model({
    showType: Util.ShowType.MYLIST,
    mylists: MyListsStore,
    urlStore: UrlStore,
    historyStore: HistoryStore,
    movieListStore: MovieListStore,
    singleMoviesStore: SingleMoviesStore,
    movieIndex: IndexStore,
    contextStore: ContextStore,

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
        self.mylists.showing = mylist;
        self.mylists.showingIndex = self.mylists.keys.indexOf(self.mylists.showing.id);
    }
    function setShowingHistory() {
        self.showType = Util.ShowType.HISTORY;
        self.mylists.showing = null;
        self.mylists.showingIndex = -1;
    }
    function setShowingMovie() {
        self.showType = Util.ShowType.MOVIE;
        self.mylists.showing = null;
        self.mylists.showingIndex = -1;
    }

    function moveToNextMylist(e) {
        self.moveToMylist(-1)
    }
    function moveToPrevMylist(e) {
        self.moveToMylist(1)
    }
    function moveToMylist(offset) {

        // mylists.keys's index is reversed on view
        offset = -offset;

        if (self.mylists.keys.length > 0) {
            if(self.mylists.showing && self.showType === Util.ShowType.MYLIST) {
                // find next
                //const currentIndex = self.mylists.keys.indexOf(self.mylists.showing.id);
                const currentIndex = self.mylists.showingIndex;
                const maxIndex = self.mylists.keys.length-1;
                let nextIndex = currentIndex+offset;
                if(nextIndex < 0){ nextIndex = 0 }
                if(maxIndex < nextIndex) { nextIndex = maxIndex; }

                if(currentIndex !== nextIndex) {
                    self.mylists.showing = self.mylists.keys[nextIndex];
                    self.mylists.showingIndex = nextIndex;
                    self.movieIndex.clear()
                }

            } else {
                // reverse index
                const nextIndex = 0;
                self.mylists.showing = self.mylists.keys[nextIndex];
                self.mylists.showingIndex = nextIndex;
                self.showType = Util.ShowType.MYLIST;
                self.movieIndex.clear()
            }
        }
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
        const current = self.mylists.showing;
        if(current) {
            current.update(self.movieListStore)
        }
    }

    return {setShowing, setShowingHistory, setShowingMovie,
        moveToMylist, moveToNextMylist, moveToPrevMylist,
        moveToMovie, moveToNextMovie, moveToPrevMovie,
        toggleWatchedForCurrent, reloadCurrentMylist,
    }
});

export default RootStore;
