import {types} from "mobx-state-tree"
import url from 'url';
import axiosBase from 'axios';
import parseXml from '@rgrove/parse-xml'
import Util from '../Util'
import MovieStore from "./MovieStore";
import MovieListStore from "./MovieListStore";

const axios = axiosBase.create({
    baseURL: 'http://www.nicovideo.jp',
    // headerがあるとランキングが取得できなかった
});


const MyListStore = types.model({
    id: types.identifier,
    title: types.optional(types.string, ""),
    author: "",
    movies: types.optional(types.array(types.reference(MovieStore)), []),
    updating: false,
    showing: false,
    movieListStore: types.reference(MovieListStore),
    locked: false,
}).views(self => ({
    get url() {
        return `http://www.nicovideo.jp/${self.id}`
    },
    get unwatchCount() {
        return self.movies.filter(m => !m.watched).length
    },
    get updatingMovieCount() {
        return self.movies.filter(m => m.updating).length
    },
})).actions(self => {

    function updateForce() {
        self.updating = false;
        self.update();
    }

    function update() {
        if (self.id && !self.updating) {
            self.setUpdating(true);

            axios.get(`/${self.id}?rss=atom`).then(res => {
                let xml = parseXml(res.data);
                let feed = xml.children[0];

                self.updateTitle(Util.xmlGetFirstChildrenText(feed, "title"));

                const authorEl = Util.xmlGetFirst(feed, "author");
                self.updateAuthor(Util.xmlGetFirstChildrenText(authorEl, "name"));

                // movies
                const movies = [];
                feed.children.filter(el => {
                    return el.type === "element" && el.name === "entry"
                }).forEach(el => {

                    // title
                    const linkEl = el.children.find(el2 => {
                        return el2.type === "element" && el2.name === "link" &&
                            el2.attributes && el2.attributes.rel === "alternate" && el2.attributes.type === "text/html" &&
                            el2.attributes.href
                    });

                    if (linkEl) {
                        const movieId = Util.normalizeMovieId(linkEl.attributes.href);
                        movies.push(movieId);
                    }

                });

                self.updateMovies(movies);
                self.setUpdating(false);


            }).catch(e => {
                console.log(e)
                self.updateTitle("Error id=" + self.id);
                self.setUpdating(false);
            });

        }


    }

    function updateTitle(title) {
        self.title = normalizeMyListTitle(title);
    }
    function updateAuthor(author) {
        self.author = author;
    }

    function updateMovies(movies) {

        // is already added?
        movies.forEach((m) => {
            const found = !!self.movies.find((m2) => {
                return m === m2.id
            } );

            if (!found) {
                self.movieListStore.add(m);
            }
        });


        self.movies = movies
    }

    function setUpdating(b) {
        self.updating = b;
    }

    function setLocked(b) {
        self.locked = b;
    }
    function toggleLocked() {
        self.locked = !self.locked;
    }

    function setShowing(b = true) {
        self.showing = b;
    }

    // private
    function normalizeMyListTitle(title) {
        // 必ず `マイリスト` が頭につくので消す
        let matches = title.match(/^マイリスト[ ]+(.*)$/);
        if(matches && matches.length > 1) {
            title =  matches[1];
        }

        matches = title.match(/^(.*)‐ニコニコ動画$/);
        if(matches && matches.length > 1) {
            title =  matches[1];
        }

        return title;
    }

    return {update, updateForce, fetch, updateTitle, updateAuthor, updateMovies, setUpdating,
        setLocked, toggleLocked, setShowing,
    }
});

export default MyListStore;
