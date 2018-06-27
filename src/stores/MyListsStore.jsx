import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";
import Util from "../Util";

const MyListsStore = types.model({
    lists: types.optional(types.map(MyListStore), {}), // not save order
    keys: types.optional(types.array(types.string), []), // save order
}).views(self => ({

    get(id_or_url) {
        return self.lists.get(Util.normalizeMylistId(id_or_url));
    },

    has(id_or_url) {
        return self.lists.has(Util.normalizeMylistId(id_or_url));
    },

    get reverse() {
        return self.keys.slice().reverse().map(k => self.lists.get(k))
    },

    get all() {
        return self.keys.map(k => self.lists.get(k))
    }

})).actions(self => {

    function add(id_or_url) {
        const id = Util.normalizeMylistId(id_or_url);

        console.log(id);

        const mylist = MyListStore.create({id: id});
        mylist.update();
        self.lists.set(id, mylist);
        self.keys.push(id);
    }

    function remove(id) {
        self.lists.delete(Util.normalizeMylistId(id));

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

    return {add, remove, moveTo}
});

export default MyListsStore;
