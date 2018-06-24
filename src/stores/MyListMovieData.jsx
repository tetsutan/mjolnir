import {types} from "mobx-state-tree"


const MyListStore = types.model({
    title: ""
}).views(self => ({
})).actions(self => {
});

export default MyListStore;
