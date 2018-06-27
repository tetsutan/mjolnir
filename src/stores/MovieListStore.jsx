import {types} from "mobx-state-tree"
import MovieStore from "./MovieStore";

const MovieListStore = types.model({
    movies: types.optional(types.map(MovieStore), {}),
}).views(self => ({
    get(movieId) {
        return self.movies.get(movieId);
    }
})).actions(self => {
    function add(movieId) {
        const movie = MovieStore.create({id: movieId});
        movie.update();
        self.movies.set(movieId, movie);
    }
    return {add}
});

export default MovieListStore;
