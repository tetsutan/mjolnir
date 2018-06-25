import {types} from "mobx-state-tree"
import axiosBase from 'axios';
import url from 'url';
import parseXml from '@rgrove/parse-xml'
import Util from '../Util'

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

    watched: false,

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

                        self.updateTitle(Util.xmlGetFirstChildrenText(thumbEl, "title"));
                        self.updateThumbnailUrl(Util.xmlGetFirstChildrenText(thumbEl, "thumbnail_url"));
                        self.updateUserName(Util.xmlGetFirstChildrenText(thumbEl, "user_nickname"));
                        self.updateUserIcon(Util.xmlGetFirstChildrenText(thumbEl, "user_icon_url"));
                        self.updateDate(Util.xmlGetFirstChildrenText(thumbEl, "first_retrieve"));
                        self.updateDescription(Util.xmlGetFirstChildrenText(thumbEl, "description"));

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

    function setWatched() {
        self.watched = true;
    }
    function toggleWatched() {
        self.watched = !self.watched
    }

    // private

    return {update, fetch, updateTitle, updateThumbnailUrl,
        updateUserName, updateUserIcon, updateDate, updateDescription,
        setWatched, toggleWatched,
    }
});

export default MyListMovieData;
