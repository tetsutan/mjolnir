import {types} from "mobx-state-tree"
import url from 'url';
import axiosBase from 'axios';
import parseXml from '@rgrove/parse-xml'
import MyListMovieData from "./MyListMovieData";

const axios = axiosBase.create({
    baseURL: 'http://www.nicovideo.jp', // バックエンドB のURL:port を指定する
    headers: {
        'ContentType': 'application/xml',
        'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'text'
});


const MyListStore = types.model({
    url: "",
    mylistNumber: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    movies: types.optional(types.array(MyListMovieData), [])
}).views(self => ({
})).actions(self => {

    function update() {
        let uri = url.parse(self.url);

        if(uri.hostname === "www.nicovideo.jp") {
            let matches = uri.pathname.match(/mylist\/([0-9]+)/);
            if(matches.length > 1) {
                self.mylistNumber = matches[1];
            }
        }


        if(self.mylistNumber) {
            self.fetch()
        }

    }

    function fetch() {
        if (self.mylistNumber) {

            axios.get(`/mylist/${self.mylistNumber}?rss=atom`).then(res => {
                let xml = parseXml(res.data);
                let feed = xml.children[0];

                // title
                let titleEl = feed.children.find((el) => {
                    return el.type === "element" && el.name === "title"
                });

                if (titleEl) {
                    let title = titleEl.children.map((textEl) => {
                        return textEl.type === "text" ? textEl.text : ""
                    }).join(" ");

                    self.updateTitle(title)
                }

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
                        movieData.update();
                        movies.push(movieData);
                    }

                });

                self.updateMovies(movies);


            }).catch(e => {
                console.log(e);
            });

        }


    }

    function updateTitle(title) {
        self.title = normalizeMyListTitle(title);
    }

    function updateMovies(movies) {
        self.movies = movies;
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

    return {update, fetch, updateTitle, updateMovies}
});

export default MyListStore;
