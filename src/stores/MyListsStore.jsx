import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";

const MyListsStore = types.model({
    lists: types.map(MyListStore),
}).views(self => ({
})).actions(self => {

    function add(id) {
        let mylist = MyListStore.create({id: id});
        mylist.update();
        // self.lists.push(mylist);
        self.lists.set(id, mylist)
        // async
    }

    return {add}
});

export default MyListsStore;
