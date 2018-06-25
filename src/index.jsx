import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'mobx-react';
import App from './components/App.jsx'
import MyListsStore from './stores/MyListsStore'
import UrlStore from "./stores/UrlStore";
import RootStore from "./stores/RootStore";


const stores = {
    mylists: MyListsStore.create({lists: []}),
    addingUrl: UrlStore.create({url: "http://www.nicovideo.jp/mylist/56168136"}),
    root: RootStore.create(),
};


render(
    <Provider {...stores} >
        <App/>
    </Provider>,
    document.getElementById('app')
);