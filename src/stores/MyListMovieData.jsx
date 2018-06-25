import {types} from "mobx-state-tree"
import axiosBase from 'axios';
import url from 'url';
import parseXml from '@rgrove/parse-xml'

const axios = axiosBase.create({
    baseURL: 'http://ext.nicovideo.jp',
    headers: {
        'ContentType': 'application/xml',
        'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'text'
});

const MyListMovieData = types.model({
    url: "",
    movieId: "",
    title: "",
    thumbnailUrl: "",
    userName: "",
    userIcon: "",
    date: "",
    description: "",

    // isLargeThumbnail: false, TODO
}).views(self => ({
})).actions(self => {
    function update() {
        let uri = url.parse(self.url);

        if(uri.hostname === "www.nicovideo.jp") {
            let matches = uri.pathname.match(/watch\/([a-zA-Z0-9]+)/);
            if(matches.length > 1) {
                self.movieId = matches[1];
            }
        }

        if(self.movieId) {
            self.fetch()
        }
    }

    function fetch() {

        if (self.movieId) {

            // http://ext.nicovideo.jp/api/getthumbinfo/sm21520922
            axios.get(`/api/getthumbinfo/${self.movieId}`).then(res => {
                const xml = parseXml(res.data);
                const nicovideo_thumb_response = xml.children[0];

                console.log(nicovideo_thumb_response);
                if (nicovideo_thumb_response && nicovideo_thumb_response.children) {

                    // find thumb
                    let thumbEl = nicovideo_thumb_response.children.find(el => {
                        return el.type === "element" && el.name === "thumb"
                    });

                    if(thumbEl && thumbEl.children) {

                        self.updateTitle(xmlGetFirstChildren(thumbEl, "title"));
                        self.updateThumbnailUrl(xmlGetFirstChildren(thumbEl, "thumbnail_url"));
                        self.updateUserName(xmlGetFirstChildren(thumbEl, "user_nickname"));
                        self.updateUserIcon(xmlGetFirstChildren(thumbEl, "user_icon_url"));
                        self.updateDate(xmlGetFirstChildren(thumbEl, "first_retrieve"));
                        self.updateDescription(xmlGetFirstChildren(thumbEl, "description"));

                    }

                }

            }).catch(e => {
                console.log(e);
            });

        }
    }

    function updateTitle(title) {
        self.title = title;
    }
    function updateThumbnailUrl(thumbUrl) {
        self.thumbnailUrl = thumbUrl;
    }
    function updateUserName(v) {
        self.userName = v;
    }
    function updateUserIcon(v) {
        self.userIcon = v;
    }
    function updateDate(v) {
        self.date = v;
    }
    function updateDescription(v) {
        self.description = v;
    }

    // private
    function xmlGetFirstChildren(el, name) {

        let targetEl = el.children.find((el) => {
            return el.type === "element" && el.name === name
        });

        if (targetEl) {
            return targetEl.children[0].text
        }
    }


    return {update, fetch, updateTitle, updateThumbnailUrl,
        updateUserName, updateUserIcon, updateDate, updateDescription}
});

export default MyListMovieData;
