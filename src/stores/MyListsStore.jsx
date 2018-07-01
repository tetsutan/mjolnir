import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";
import Util from "../Util";

const MyListsStore = types.model({
    lists: types.optional(types.map(MyListStore), {}), // not save order
    keys: types.optional(types.array(types.string), []), // save order
    showingIndex: -1, // for keys
}).views(self => ({

    get(id_or_url) {
        return self.lists.get(Util.normalizeMylistId(id_or_url));
    },

    has(id_or_url) {
        return self.lists.has(Util.normalizeMylistId(id_or_url));
    },

    get reverse() {
        return self.keys.map(k => self.lists.get(k))
    },

    get length() {
        return self.keys.length;
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

    function add(id_or_url, movieListStore) {
        const id = Util.normalizeMylistId(id_or_url);

        if(!self.lists.has(id)) {
            const mylist = MyListStore.create({id: id});
            mylist.update(movieListStore);
            self.lists.set(id, mylist);
            self.keys.unshift(id);
        }
    }

    function remove(id_or_url) {
        const id = Util.normalizeMylistId(id_or_url);

        if(self.showing && self.showing.id === id){
            self.showingIndex = -1;
        }

        self.lists.delete(id);

        const index = self.keys.indexOf(id);
        self.keys.splice(index, 1) ;
    }

    function moveTo(src, dst) {
        const srcIndex = self.keys.indexOf(src);
        const dstIndex = self.keys.indexOf(dst);

        if(srcIndex >= 0 && dstIndex >= 0) {
            self.keys.splice(srcIndex, 1);
            self.keys.splice(dstIndex, 0, src)
        }
    }

    function positionToMylist(offset) {

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
                    self.lists.get(self.keys[nextIndex]).showing = true;
                    self.showingIndex = nextIndex;
                }

            }
            else {
                // reverse index
                const nextIndex = 0;

                const currentShowing = self.showing;
                if(currentShowing) {
                    currentShowing.showing = false;
                }
                self.lists.get(self.keys[nextIndex]).showing = true;
                self.showingIndex = nextIndex;
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

    return {add, remove, moveTo, positionToMylist, setShowing, clearShowingIndex}
});

export default MyListsStore;
