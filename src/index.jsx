import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'mobx-react';
import App from './components/App.jsx'
import MyListsStore from './stores/MyListsStore'
import UrlStore from "./stores/UrlStore";


const stores = {
    mylists: MyListsStore.create({lists: []}),
    addingUrl: UrlStore.create({url: ""}),
};


render(
    <Provider {...stores} >
        <App/>
    </Provider>,
    document.getElementById('app')
);