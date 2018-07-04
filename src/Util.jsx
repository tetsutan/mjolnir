import url from 'url';

const Util = {

    ShowType : {
        MYLIST: 'MYLIST',
        HISTORY: 'HISTORY',
        MOVIE: 'MOVIE',
    },


    RankingInfo: {
        SortType: [
            "fav",
            "view",
            "res",
            'mylist',
        ],
        SortTerm: [
            'hourly',
            'daily',
            'weekly',
            'monthly',
            'total',
        ],

    },

    normalizeMylistOrRankingId: function(id_or_url){

        // mylist
        const mylistId = Util.normalizeMylistId(id_or_url);
        if(mylistId) {
            return `mylist/${mylistId}`;
        }

        // ranking
        const rankingId = Util.normalizeRankingId(id_or_url);
        if(rankingId) {
            return `ranking/${rankingId}`;
        }

        return "";
    },

    normalizeMylistId: function(id_or_url) {
        id_or_url = id_or_url.trim();

        let matches = id_or_url.match(/^(\d+)$/);
        if(matches && matches.length > 1) {
            return matches[1];
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

    normalizeRankingId: function(id_or_url) {
        id_or_url = id_or_url.trim();

        let info = {};

        // http://www.nicovideo.jp/ranking/fav/daily/game?rss=2.0&lang=ja-jp
        let matches = id_or_url.match(/ranking\/(\w+)\/(\w+)\/(\w+)$/);
        if(matches && matches.length > 3) {
            info = { sortType: matches[1], sortTerm: matches[2], category: matches[3]};
        } else {

            const uri = url.parse(id_or_url);
            if(uri.hostname === "www.nicovideo.jp") {
                const paths = uri.pathname.split('/');
                // let matches = uri.pathname.match(/ranking\/([a-z]+)\/([a-z]+)\/([a-z]+)$/);
                if(paths && paths.length > 3) {
                    info = { sortType: paths[1], sortTerm: paths[2], category: paths[3]};
                }
            }
        }

        // カテゴリチェックは無し
        if(Util.RankingInfo.SortType.includes(info.sortType) &&
            Util.RankingInfo.SortTerm.includes(info.sortTerm)
        ) {
            return `${info.sortType}/${info.sortTerm}/${info.category}`;
        }


        return "";
    },

    normalizeMovieId: function(id_or_url) {
        id_or_url = id_or_url.trim();

        // http://www.nicovideo.jp/watch/sm33108816
        let matches = id_or_url.match(/^((sm|so)\d+)$/);
        if(matches && matches.length > 1) {
            return  matches[1];
        } else {
            let matches = id_or_url.match(/watch\/((sm|so)\d+)$/);
            if(matches && matches.length > 1) {
                return matches[1];
            } else {

                const uri = url.parse(id_or_url);
                if(uri.hostname === "www.nicovideo.jp") {
                    let matches = uri.pathname.match(/watch\/((sm|so)\d+)/);
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
