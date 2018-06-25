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
    }

};

export default Util
