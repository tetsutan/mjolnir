import {types} from "mobx-state-tree"

const IndexStore = types.model({
    index: -1
}).views(self => ({
    is(other) {
        return self.index === other
    }
})) .actions(self => {
    function clear() {
        self.index = -1;
    }

    function set(index) {
        self.index = index
    }

    return {clear, set};
});

export default IndexStore;
