import {types} from "mobx-state-tree"
import MovieStore from "./MovieStore";
import Util from "../Util";

const SingleMoviesStore = types.model({
    movies: types.optional(types.array(types.reference(MovieStore)), []),
}).views(self => ({
    get(index) {
        return self.movies[index];
    }
})).actions(self => {

    // function add(movie) {
    //     self.movies.push(movie)
    // }

    function add(url, movieListStore) {
        const movieId = Util.normalizeMovieId(url);
        // // const movieData = MovieStore.create({id: movieId});
        movieListStore.add(movieId);
        const movie = movieListStore.get(movieId);
        self.movies.push(movie);
    }

    function addExistsMovie(movie) {
        self.movies.push(movie);
    }

    function removeFromIndex(index) {
        self.movies.splice(index, 1) ;
    }

    return {add, removeFromIndex, addExistsMovie}
});

export default SingleMoviesStore;
