import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";

const MyListsStore = types.model({
    lists: types.array(MyListStore)
}).views(self => ({
})).actions(self => {

    function add(url) {
        self.lists.push(MyListStore.create({url: url}));
        // async
    }

    return {add}
});

export default MyListsStore;
