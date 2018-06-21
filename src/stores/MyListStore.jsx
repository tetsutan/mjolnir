import {types} from "mobx-state-tree"

const MyListStore = types.model({
    url: ""
}).views(self => ({
})).actions(self => {

    function onUpdatedURL() {
        // async
    }

    return {onUpdatedURL}
});

export default MyListStore;
