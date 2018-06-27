import {types} from "mobx-state-tree"
import MyListsStore from "./MyListsStore";
import UrlStore from "./UrlStore";
import IndexStore from "./IndexStore";
import Util from "../Util";
import HistoryStore from "./HistoryStore";
import MovieListStore from "./MovieListStore";


const RootStore = types.model({
    showing: "",
    showType: Util.ShowType.MYLIST,
    mylists: MyListsStore,
    urlStore: UrlStore,
    historyStore: HistoryStore,
    movieListStore: MovieListStore,

}).views(self => ({
    get isShowingHistory() {
        return self.showType === Util.ShowType.HISTORY;
    },
    get isShowingMovie() {
        return self.showType === Util.ShowType.MOVIE;
    }
})).actions(self => {
    function setShowing(key) {
        self.showType = Util.ShowType.MYLIST;
        self.showing = key;
    }
    function setShowingHistory() {
        self.showType = Util.ShowType.HISTORY;
        self.showing = "";
    }
    function setShowingMovie() {
        self.showType = Util.ShowType.MOVIE;
        self.showing = "";
    }
    return {setShowing, setShowingHistory, setShowingMovie}
});

export default RootStore;
