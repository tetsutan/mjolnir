import {types} from "mobx-state-tree"
import MyListStore from "./MyListStore";

const RootStore = types.model({
    showing: -1
}).views(self => ({
})).actions(self => {
    function setCurrent(index) {
        self.showing = index;
    }
    return {setCurrent}
});

export default RootStore;
