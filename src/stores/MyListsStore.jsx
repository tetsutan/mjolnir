import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";

const MyListsStore = types.model({
    lists: types.map(MyListStore),
}).views(self => ({
})).actions(self => {

    function add(id) {

        if(/^\d+$/.test(id)) {
            id = `mylist/${id}`
        }

        let mylist = MyListStore.create({id: id});
        mylist.update();
        self.lists.set(id, mylist)
    }

    return {add}
});

export default MyListsStore;
