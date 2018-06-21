import {types} from "mobx-state-tree"

const UrlStore = types.model({
    url: types.string
}).views(self => ({

    get isNicoUrl() {
        // httpなし、mylistIDだけからも通せるようにする
        return /^http([s]?):\/\/www.nicovideo.jp/g.test(self.url)
    },

    get hasError() {
        return self.url !== "" && !self.isNicoUrl
    }

}))
    .actions(self => {
    function onChange(e) {
        self.url = e.target.value;
    }

    function clear() {
        self.url = "";
    }

    return {onChange, clear};
});

export default UrlStore;
