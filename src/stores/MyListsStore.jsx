import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";
import Util from "../Util";

const MyListsStore = types.model({
    lists: types.map(MyListStore),
}).views(self => ({

    get(id_or_url) {
        return self.lists.get(Util.normalizeMylistId(id_or_url));
    },

    has(id_or_url) {
        return self.lists.has(Util.normalizeMylistId(id_or_url));
    },

})).actions(self => {

    function add(id_or_url) {
        const id = Util.normalizeMylistId(id_or_url);

        console.log(id);

        const mylist = MyListStore.create({id: id});
        mylist.update();
        self.lists.set(id, mylist)
    }

    function remove(id) {
        self.lists.delete(Util.normalizeMylistId(id))
    }

    return {add, remove}
});

export default MyListsStore;
