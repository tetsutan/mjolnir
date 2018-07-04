import {types} from "mobx-state-tree"
import Util from "../Util";

const UrlStore = types.model({
    url: "",
}).views(self => ({

    get hasError() {
        return self.url !== "" && !(Util.normalizeMovieId(self.url) || Util.normalizeMylistOrRankingId(self.url))
    }

}))
    .actions(self => {
    function handleChange(e) {
        self.url = e.target.value;
    }

    function clear() {
        self.url = "";
    }

    return {handleChange, clear};
});

export default UrlStore;
