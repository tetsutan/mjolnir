import React from 'react'
import {render} from 'react-dom'
import { ipcRenderer } from 'electron'
import { Provider } from 'mobx-react';
import App from './components/App.jsx'
import MyListsStore from './stores/MyListsStore'
import UrlStore from "./stores/UrlStore";
import RootStore from "./stores/RootStore";
import ErrorStore from "./stores/ErrorStore";
import {onSnapshot, getSnapshot } from "mobx-state-tree";
import storage from 'electron-json-storage';
import IndexStore from "./stores/IndexStore";
import isDev from 'electron-is-dev';

let stateFileName = 'state.json';
if (isDev) {
    stateFileName = 'state.development.json'
}

storage.get(stateFileName, (error, data) => {
    if (error) throw error;

    let stores;
    if (Object.keys(data).length === 0) {
        // new
        stores = {
            root: RootStore.create({
                mylists: MyListsStore.create({lists: {}}),
                urlStore: UrlStore.create({url: "http://www.nicovideo.jp/mylist/56168136"}),
            }),
            movieIndex: IndexStore.create(),
            urlStoreError: ErrorStore.create(),
        };
    } else {
        // from state file
        stores = {
            root: RootStore.create(data),
            movieIndex: IndexStore.create(),
            urlStoreError: ErrorStore.create(),
        }
    }
    // save state before close
    ipcRenderer.on("app-close", (ev) => {
        const snapshot = getSnapshot(stores.root);
        storage.set(stateFileName, snapshot, error => {
            if (error) throw error;
            ipcRenderer.send('closed');
        });
    });


    render(
        <Provider {...stores} >
            <App/>
        </Provider>,
        document.getElementById('app')
    );

});



