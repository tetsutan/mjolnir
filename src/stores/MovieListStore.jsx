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
        if(!self.movies.has(movieId)) {
            const movie = MovieStore.create({id: movieId});
            self.movies.set(movieId, movie);
        }

        const movie = self.movies.get(movieId);
        movie.update();
    }
    return {add}
});

export default MovieListStore;
