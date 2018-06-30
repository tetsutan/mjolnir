import {types} from "mobx-state-tree"
import url from 'url';
import axiosBase from 'axios';
import parseXml from '@rgrove/parse-xml'
import MyListMovieData from "./MyListMovieData";
import Util from '../Util'
import MovieStore from "./MovieStore";

const axios = axiosBase.create({
    baseURL: 'http://www.nicovideo.jp',
    headers: {
        'ContentType': 'application/xml',
        'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'text'
});


const MyListStore = types.model({
    id: types.identifier(types.string),
    title: types.optional(types.string, ""),
    author: "",
    movies: types.optional(types.array(types.reference(MovieStore)), []),
    updating: false
}).views(self => ({
    get url() {
        return `http://www.nicovideo.jp/mylist/${self.id}`
    },
    get unwatchCount() {
        return self.movies.filter(m => !m.watched).length
    },
})).actions(self => {

    function update(movieListStore) {
        if (self.id && !self.updating) {
            self.setUpdating(true);

            axios.get(`/mylist/${self.id}?rss=atom`).then(res => {
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
                        if(movieListStore) {
                            const movieId = Util.normalizeMovieId(linkEl.attributes.href);
                            movieListStore.add(movieId);
                            movies.push(movieId);
                        }
                    }

                });

                self.updateMovies(movies);
                self.setUpdating(false);


            }).catch(e => {
                console.log(e);
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
        self.movies = movies
    }

    function setUpdating(b) {
        self.updating = b;
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

    return {update, fetch, updateTitle, updateAuthor, updateMovies, setUpdating}
});

export default MyListStore;
