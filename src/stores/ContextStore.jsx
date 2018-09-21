import {types} from "mobx-state-tree"

const ContextStore = types.model({
    version: 1,
    lastUpdatedAt: types.maybeNull(types.Date),
}).views(self => ({
})) .actions(self => {
    function update() {
        self.lastUpdatedAt = new Date();
    }
    return {update}
});

export default ContextStore;
