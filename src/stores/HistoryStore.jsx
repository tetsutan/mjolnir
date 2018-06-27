import {getSnapshot, types} from "mobx-state-tree"
import MyListMovieData from "./MyListMovieData";

const HistoryStore = types.model({
    movies: types.optional(types.array(types.reference(MyListMovieData)), []),
}).views(self => ({
})).actions(self => {

    function add(movieData) {
        self.movies.push(movieData.id)
    }


    return {add}
});

export default HistoryStore;
