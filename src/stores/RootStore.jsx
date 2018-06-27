import {types} from "mobx-state-tree"
import MyListsStore from "./MyListsStore";
import MyListStore from "./MyListStore";
import UrlStore from "./UrlStore";
import IndexStore from "./IndexStore";
import Util from "../Util";
import HistoryStore from "./HistoryStore";
import MovieListStore from "./MovieListStore";


const RootStore = types.model({
    showing: types.maybe(types.reference(MyListStore)),
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
    function setShowing(mylist) {
        self.showType = Util.ShowType.MYLIST;
        self.showing = mylist;
    }
    function setShowingHistory() {
        self.showType = Util.ShowType.HISTORY;
        self.showing = null;
    }
    function setShowingMovie() {
        self.showType = Util.ShowType.MOVIE;
        self.showing = null;
    }
    return {setShowing, setShowingHistory, setShowingMovie}
});

export default RootStore;
