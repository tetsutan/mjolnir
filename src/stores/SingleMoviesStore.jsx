import {types} from "mobx-state-tree"
import MovieStore from "./MovieStore";
import Util from "../Util";
import MovieListStore from "./MovieListStore";

const SingleMoviesStore = types.model({
    movies: types.optional(types.array(types.reference(MovieStore)), []),
    movieListStore: types.reference(MovieListStore),
}).views(self => ({
    get(index) {
        return self.movies[index];
    }
})).actions(self => {

    function add(url) {
        const movieId = Util.normalizeMovieId(url);
        self.movieListStore.add(movieId);
        const movie = self.movieListStore.get(movieId);
        self.addExistsMovie(movie);
    }

    function addExistsMovie(movie) {
        const index = self.movies.indexOf(movie);
        if(index >= 0) {
            self.movies.splice(index, 1)
        }
        self.movies.push(movie);
    }

    function removeFromIndex(index) {
        self.movies.splice(index, 1) ;
    }

    function clear() {
        self.movies.clear()
    }

    return {add, removeFromIndex, addExistsMovie, clear}
});

export default SingleMoviesStore;
