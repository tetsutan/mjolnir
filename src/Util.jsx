import url from 'url';

const Util = {

    normalizeMylistId: function(id_or_url) {

        let matches = id_or_url.match(/^(\d+)$/);
        if(matches && matches.length > 1) {
            return  matches[1];
        } else {
            let matches = id_or_url.match(/mylist\/(\d+)$/);
            if(matches && matches.length > 1) {
                return matches[1];
            } else {

                const uri = url.parse(id_or_url);
                if(uri.hostname === "www.nicovideo.jp") {
                    let matches = uri.pathname.match(/mylist\/(\d+)/);
                    if(matches && matches.length > 1) {
                        return matches[1];
                    }
                }

            }
        }

        return "";
    },

    normalizeMovieId: function(id_or_url) {

        // http://www.nicovideo.jp/watch/sm33108816
        let matches = id_or_url.match(/^(sm\d+)$/);
        if(matches && matches.length > 1) {
            return  matches[1];
        } else {
            let matches = id_or_url.match(/watch\/(sm\d+)$/);
            if(matches && matches.length > 1) {
                return matches[1];
            } else {

                const uri = url.parse(id_or_url);
                if(uri.hostname === "www.nicovideo.jp") {
                    let matches = uri.pathname.match(/watch\/(sm\d+)/);
                    if(matches && matches.length > 1) {
                        return matches[1];
                    }
                }

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
