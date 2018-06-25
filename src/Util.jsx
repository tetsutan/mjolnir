import url from 'url';

const Util = {

    getMyListNumberFromUrl: function(u) {

        let uri = url.parse(u);

        if(uri.hostname === "www.nicovideo.jp") {
            let matches = uri.pathname.match(/mylist\/([0-9]+)/);
            if(matches.length > 1) {
                return matches[1];
            }
        }

        return "";
    },

    xmlGetFirst: function(el, name) {
        return el.children.find((el) => {
            return el.type === "element" && el.name === name
        });
    },

    xmlGetFirstChildrenText: function(el, name) {
        let targetEl = el.children.find((el) => {
            return el.type === "element" && el.name === name
        });

        if (targetEl) {
            return targetEl.children[0].text
        }
    }

};

export default Util
