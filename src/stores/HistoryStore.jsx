import {getSnapshot, types} from "mobx-state-tree"
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

    function clear() {
        self.movies.clear()
    }

    function clearOlder(n) {
        const len = self.movies.length;
        if(len >= n) {
            self.movies.splice(0, self.movies.length - n + 1)
        }
    }


    return {add, removeFromIndex, clear, clearOlder}
});

export default HistoryStore;
