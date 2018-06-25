import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'mobx-react';
import App from './components/App.jsx'
import MyListsStore from './stores/MyListsStore'
import UrlStore from "./stores/UrlStore";
import RootStore from "./stores/RootStore";
import {onSnapshot} from "mobx-state-tree";
import storage from 'electron-json-storage';


storage.get('state.json', (error, data) => {
    if (error) throw error;

    let stores;
    if (Object.keys(data).length === 0) {
        // new
        stores = {
            root: RootStore.create({
                mylists: MyListsStore.create({lists: []}),
                urlStore: UrlStore.create({url: "http://www.nicovideo.jp/mylist/56168136"}),
            }),
        };
    } else {
        // from state file
        stores = {
            root: RootStore.create(data)
        }
    }

    onSnapshot(stores.root, snapshot => {
        const dataPath = storage.getDataPath();
        console.log(dataPath);
        console.log(snapshot);

        storage.set('state.json', snapshot, error => {
            if (error) throw error;


        });
    });

    render(
        <Provider {...stores} >
            <App/>
        </Provider>,
        document.getElementById('app')
    );

});


