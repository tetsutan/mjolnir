import {types} from "mobx-state-tree"
import MyListsStore from "./MyListsStore";
import UrlStore from "./UrlStore";

const RootStore = types.model({
    showing: "",
    mylists: MyListsStore,
    urlStore: UrlStore,

}).views(self => ({
})).actions(self => {
    function setCurrent(index) {
        self.showing = index;
    }
    return {setCurrent}
});

export default RootStore;
