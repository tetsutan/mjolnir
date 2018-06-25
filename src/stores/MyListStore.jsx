import {types} from "mobx-state-tree"
import url from 'url';
import axiosBase from 'axios';
import parseXml from '@rgrove/parse-xml'
import MyListMovieData from "./MyListMovieData";
import Util from '../Util'

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
    movies: types.optional(types.array(MyListMovieData), []),
    updating: false
}).views(self => ({
    get url() {
        return `http://www.nicovideo.jp/mylist/${self.id}`
    },
})).actions(self => {

    function update() {
        if(self.id) {
            self.fetch()
        }

    }

    function fetch() {
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
                        const movieData = MyListMovieData.create({url: linkEl.attributes.href});
                        movies.push(movieData);
                    }

                });

                self.updateMovies(movies);
                self.setUpdating(false);


            }).catch(e => {
                console.log(e);
            });

        }


    }

    function updateTitle(title) {
        self.title = normalizeMyListTitle(title);
    }
    function updateAuthor(author) {
        console.log(author);;
        self.author = author;
    }

    function updateMovies(movies) {

        // 並び順を最新の並び順でとりたい
        const ms = movies.map(m => {
            const found = self.movies.find(m2 => m2.url === m.url);
            console.log(found);
            if(found) {
                return found;
            }

            m.update();
            return m;
        });

        self.movies = ms
    }

    function setUpdating(b) {
        self.updating = b;
    }

    // private
    function normalizeMyListTitle(title) {
        // 必ず `マイリスト` が頭につくので消す
        let matches = title.match(/^マイリスト[ ]+(.*)$/);
        if(matches.length > 1) {
            title =  matches[1];
        }

        matches = title.match(/^(.*)‐ニコニコ動画$/);
        if(matches.length > 1) {
            title =  matches[1];
        }

        return title;
    }

    return {update, fetch, updateTitle, updateAuthor, updateMovies, setUpdating}
});

export default MyListStore;
