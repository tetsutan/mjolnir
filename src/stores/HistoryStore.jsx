import {getSnapshot, types} from "mobx-state-tree"
import MyListMovieData from "./MyListMovieData";
import MovieStore from "./MovieStore";

const HistoryStore = types.model({
    movies: types.optional(types.array(types.reference(MovieStore)), []),
}).views(self => ({
})).actions(self => {

    function add(movie) {
        self.movies.push(movie.id)
    }


    return {add}
});

export default HistoryStore;
