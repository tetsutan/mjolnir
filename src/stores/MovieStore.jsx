import {types} from "mobx-state-tree"
import axiosBase from 'axios';
import parseXml from '@rgrove/parse-xml'
import Util from '../Util'
// import dateformat from 'dateformat'
import dateFns from 'date-fns'

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
    date: types.maybe(types.Date),
    dateS: "",
    description: "",
    length: "",

    updating: false,
    watched: false,
    deleted: false,

    // isLargeThumbnail: false, TODO
}).views(self => ({

    get url() {
        return `http://www.nicovideo.jp/watch/${self.id}`
    },

    get dateString() {
        if(self.date) {
            return dateFns.format(self.date, 'YYYY/MM/DD HH:mm:ss')
        }
        return self.dateS;
    },

    get dateType() {
        if(self.date) {
            const current = new Date();
            const lastDay = dateFns.addDays(current, -1);
            const lastWeek = dateFns.addWeeks(current, -1);
            const lastMonth = dateFns.addMonths(current, -1);

            if(dateFns.isAfter(self.date, lastDay)) {
                return Util.DateType.DAY;
            }
            else if(dateFns.isAfter(self.date, lastWeek)) {
                return Util.DateType.WEEK;
            }
            else if(dateFns.isAfter(self.date, lastMonth)) {
                return Util.DateType.MONTH;
            }

        }
        return Util.DateType.OLD;
    }

})).actions(self => {

    function updateForce() {
        self.updating = false;
        self.update();
    }


    function update() {

        if (self.id && !self.updating) {
            self.setUpdating(true);

            // http://ext.nicovideo.jp/api/getthumbinfo/sm21520922
            axios.get(`/api/getthumbinfo/${self.id}`).then(res => {
                const xml = parseXml(res.data);
                const nicovideo_thumb_response = xml.children[0];

                if (nicovideo_thumb_response) {

                    if(nicovideo_thumb_response.attributes && nicovideo_thumb_response.attributes.status === 'fail') {
                        // deleted
                        self.setDeleted();
                    } else if(nicovideo_thumb_response.children) {

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
                            self.updateLength(Util.xmlGetFirstChildrenText(thumbEl, "length"));

                        }

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
            self.date = d;
            self.dateS = "";
        } else {
            self.date = null;
            self.dateS = v;
        }

    }
    function updateDescription(v) {
        self.description = v;
    }
    function updateLength(v) {
        self.length = v;
    }

    function setUpdating(b) {
        self.updating = b;
    }
    function setWatched(w=true) {
        self.watched = w;
    }
    function toggleWatched() {
        self.watched = !self.watched
    }
    function setDeleted() {
        self.deleted = true;
    }


    // private

    return {update, updateForce, updateTitle, updateThumbnailUrl,
        updateUserName, updateUserIcon, updateDate, updateDescription, updateLength,
        setUpdating, setWatched, toggleWatched, setDeleted,
    }
});

export default MovieStore;
