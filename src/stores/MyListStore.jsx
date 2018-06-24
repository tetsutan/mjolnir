import {types} from "mobx-state-tree"
import url from 'url';
import axiosBase from 'axios';
import parseXml from '@rgrove/parse-xml'

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

                let titleEl = feed.children.find((el) => {
                    return el.type === "element" && el.name === "title"
                });

                if (titleEl) {
                    let title = titleEl.children.map((textEl) => {
                        return textEl.type === "text" ? textEl.text : ""
                    }).join(" ");

                    self.updateTitle(title)
                }

            }).catch(e => {
                console.log(e);
            });

        }


    }

    function updateTitle(title) {
        self.title = normalizeMyListTitle(title);
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

    return {update, fetch, updateTitle}
});

export default MyListStore;
