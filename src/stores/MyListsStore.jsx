import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";

const MyListsStore = types.model({
    lists: types.array(MyListStore)
}).views(self => ({
})).actions(self => {

    function add(url) {
        let mylist = MyListStore.create({url: url});
        mylist.update();
        self.lists.push(mylist);
        // async
    }

    return {add}
});

export default MyListsStore;
