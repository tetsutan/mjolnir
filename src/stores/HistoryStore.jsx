import {getSnapshot, types} from "mobx-state-tree"
import MyListMovieData from "./MyListMovieData";
import MovieStore from "./MovieStore";

const HistoryStore = types.model({
    movies: types.optional(types.array(types.reference(MovieStore)), []),
}).views(self => ({
    get(index) {
        return self.movies[index];
    }
})).actions(self => {

    function add(movie) {
        self.movies.push(movie.id)
    }

    function removeFromIndex(index) {
        self.movies.splice(index, 1) ;
    }


    return {add, removeFromIndex}
});

export default HistoryStore;
