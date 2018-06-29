import {types} from "mobx-state-tree"
import axiosBase from 'axios';
import parseXml from '@rgrove/parse-xml'
import Util from '../Util'
import dateformat from 'dateformat'

const axios = axiosBase.create({
    baseURL: 'http://ext.nicovideo.jp',
    headers: {
        'ContentType': 'application/xml',
        'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'text'
});

const MovieStore = types.model({
    // url: "",
    // movieId: "",
    id: types.identifier(types.string),
    title: "",
    thumbnailUrl: "",
    userName: "",
    userIcon: "",
    date: "",
    description: "",

    updating: false,
    watched: false,

    // isLargeThumbnail: false, TODO
}).views(self => ({

    get url() {
        return `http://www.nicovideo.jp/watch/${self.id}`
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

            // http://ext.nicovideo.jp/api/getthumbinfo/sm21520922
            axios.get(`/api/getthumbinfo/${self.id}`).then(res => {
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

                self.setUpdating(false);

            }).catch(e => {
                console.log(e);
                self.updateTitle("Error id=" + self.id);
                self.setUpdating(false);
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
        const d = Date.parse(v);
        if(d) {
            self.date = dateformat(d, 'yyyy/mm/dd HH:MM:ss')
        } else {
            self.date = v;
        }

    }
    function updateDescription(v) {
        self.description = v;
    }

    function setUpdating(b) {
        self.updating = b;
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
        setUpdating, setWatched, toggleWatched,
    }
});

export default MovieStore;
