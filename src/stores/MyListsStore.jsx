import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";
import Util from "../Util";
import MovieListStore from "./MovieListStore";

const MyListsStore = types.model({
    lists: types.optional(types.map(MyListStore), {}), // not save order
    _keys: types.optional(types.array(types.string), []), // save order without lock
    showingIndex: -1, // for keys
    movieListStore: types.reference(MovieListStore),
}).views(self => ({

    get(id_or_url) {
        return self.lists.get(Util.normalizeMylistOrRankingId(id_or_url));
    },

    has(id_or_url) {
        return self.lists.has(Util.normalizeMylistOrRankingId(id_or_url));
    },

    get items() {
        return self.keys.map(k => self.lists.get(k)).slice().sort((a,b) => {
            // lockされてたら前にもっていく
            if(a.locked === b.locked) {
                return 0;
            } else {
                return a.locked ? -1 : 1;
            }

        })
    },

    get keys() {
        return self._keys.sort((a,b) => {
            a = self.lists.get(a);
            b = self.lists.get(b);
            if(a.locked === b.locked) {
                return 0;
            } else {
                return a.locked ? -1 : 1;
            }
        })
    },

    get length() {
        return self._keys.length;
    },

    get showing() {
        if(self.showingIndex === -1) {
            return null;
        }
        return self.lists.get(self.keys[self.showingIndex])
    },

    isShowing(mylist) {
        if(self.showingIndex === -1) {
            return false
        }
        return self.keys.indexOf(mylist.id) === self.showingIndex
    },

})).actions(self => {

    function add(id_or_url) {
        const id = Util.normalizeMylistOrRankingId(id_or_url);

        if(!self.lists.has(id)) {
            const mylist = MyListStore.create({id: id, movieListStore: self.movieListStore});
            mylist.update();
            self.lists.set(id, mylist);
            self._keys.unshift(id);
            if(self.showing) {
                self.showingIndex++;
            }
        }
    }

    function remove(id_or_url) {
        const id = Util.normalizeMylistOrRankingId(id_or_url);

        if(self.showing && self.showing.id === id){
            self.showingIndex = -1;
        }

        self.lists.delete(id);

        const index = self._keys.indexOf(id);
        self._keys.splice(index, 1) ;
    }

    function moveTo(src, dst) {
        const srcIndex = self._keys.indexOf(src);
        const dstIndex = self._keys.indexOf(dst);

        if(srcIndex >= 0 && dstIndex >= 0) {
            self._keys.splice(srcIndex, 1);
            self._keys.splice(dstIndex, 0, src)
        }
    }

    function moveToFirst(mylist) {
        const src = mylist.id;
        const srcIndex = self._keys.indexOf(src);
        const dstIndex = 0;

        if(srcIndex >= 0 && dstIndex >= 0) {
            self._keys.splice(srcIndex, 1);
            self._keys.splice(dstIndex, 0, src)
        }
    }

    function moveToMylistIndex(offset) {

        // mylists.keys's index is reversed on view
        offset = -offset;

        if (self.length > 0) {
            if(self.showingIndex !== -1) {
                // find next
                const currentIndex = self.showingIndex;
                const maxIndex = self.length-1;
                let nextIndex = currentIndex+offset;
                if(nextIndex < 0){ nextIndex = 0 }
                if(maxIndex < nextIndex) { nextIndex = maxIndex; }

                if(currentIndex !== nextIndex) {
                    const currentShowing = self.showing;
                    if(currentShowing) {
                        currentShowing.showing = false;
                    }
                    const nextKey = self.keys[nextIndex];
                    self.lists.get(nextKey).showing = true;
                    self.showingIndex = nextIndex;
                }

            }
            else {
                positionToMylistIndex(0)
            }
        }
    }

    function positionToMylistIndex(nextIndex) {

        if (self.length > 0) {

            if(nextIndex !== self.showingIndex) {

                const currentShowing = self.showing;

                if(currentShowing) {
                    currentShowing.showing = false;
                }
                const nextKey = self.keys[nextIndex];
                const originalIndex = self._keys.indexOf(nextKey);
                self.lists.get(nextKey).showing = true;
                self.showingIndex = originalIndex;
            }

        }

    }

    function setShowing(mylist) {

        const currentShowing = self.showing;
        if(currentShowing) {
            currentShowing.showing = false;
        }

        self.showingIndex = self.keys.indexOf(mylist.id);
        mylist.showing = true;
    }

    function clearShowingIndex() {

        if(self.showingIndex !== -1) {
            const currentShowing = self.showing;
            if(currentShowing) {
                currentShowing.showing = false;
            }

            self.showingIndex = -1;
        }
    }

    return {add, remove, moveTo, moveToFirst, moveToMylistIndex, positionToMylistIndex, setShowing, clearShowingIndex}
});

export default MyListsStore;
