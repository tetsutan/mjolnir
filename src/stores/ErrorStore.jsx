import {types} from "mobx-state-tree"

const ErrorStore = types.model({
    message: ""
}).views(self => ({
    get hasError() {
        return self.message !== ""
    }
}))
    .actions(self => {
        function set(m) {
            self.message = m;
        }

        function clear() {
            self.message = "";
        }
        function clearAfter(sec) {
            setTimeout(() => {
                self.clear();
            }, sec * 1000);
        }

        return {set, clear, clearAfter};
    });

export default ErrorStore;
