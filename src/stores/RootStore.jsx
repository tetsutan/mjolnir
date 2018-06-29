import {types} from "mobx-state-tree"
import MyListsStore from "./MyListsStore";
import MyListStore from "./MyListStore";
import UrlStore from "./UrlStore";
import IndexStore from "./IndexStore";
import Util from "../Util";
import HistoryStore from "./HistoryStore";
import MovieListStore from "./MovieListStore";
import SingleMoviesStore from "./SingleMoviesStore";


const RootStore = types.model({
    showing: types.maybe(types.reference(MyListStore)),
    showType: Util.ShowType.MYLIST,
    mylists: MyListsStore,
    urlStore: UrlStore,
    historyStore: HistoryStore,
    movieListStore: MovieListStore,
    singleMoviesStore: SingleMoviesStore,
    movieIndex: IndexStore,

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
            if(self.showing) {
                return self.showing.movies;
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
        self.showing = mylist;
    }
    function setShowingHistory() {
        self.showType = Util.ShowType.HISTORY;
        self.showing = null;
    }
    function setShowingMovie() {
        self.showType = Util.ShowType.MOVIE;
        self.showing = null;
    }

    function moveToNextMylist(e) {
        self.moveToMylist(1)
    }
    function moveToPrevMylist(e) {
        self.moveToMylist(-1)
    }
    function moveToMylist(offset) {

        // mylists.keys's index is reversed on view
        offset = -offset;

        if (self.mylists.keys.length > 0) {
            if(self.showing && self.showType === Util.ShowType.MYLIST) {
                // find next
                const currentIndex = self.mylists.keys.indexOf(self.showing.id);
                const maxIndex = self.mylists.keys.length-1;
                let nextIndex = currentIndex+offset;
                if(nextIndex < 0){ nextIndex = 0 }
                if(maxIndex < nextIndex) { nextIndex = maxIndex; }

                if(currentIndex !== nextIndex) {
                    self.showing = self.mylists.keys[nextIndex];
                    self.movieIndex.clear()
                }

            } else {
                // reverse index
                self.showing = self.mylists.keys[self.mylists.keys.length-1];
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
        if(self.showing && self.showType === Util.ShowType.MYLIST) {
            maxIndex = self.showing.movies.length-1
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

    return {setShowing, setShowingHistory, setShowingMovie,
        moveToMylist, moveToNextMylist, moveToPrevMylist,
        moveToMovie, moveToNextMovie, moveToPrevMovie,
        toggleWatchedForCurrent,
    }
});

export default RootStore;
