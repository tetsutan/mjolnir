import React from 'react'
import {render} from 'react-dom'
import { ipcRenderer } from 'electron'
import { Provider } from 'mobx-react';
import App from './components/App.jsx'
import MyListsStore from './stores/MyListsStore'
import UrlStore from "./stores/UrlStore";
import RootStore from "./stores/RootStore";
import MessageStore from "./stores/MessageStore";
import {getSnapshot } from "mobx-state-tree";
import storage from 'electron-json-storage';
import IndexStore from "./stores/IndexStore";
import isDev from 'electron-is-dev';
import HistoryStore from "./stores/HistoryStore";
import MovieListStore from "./stores/MovieListStore";
import SingleMoviesStore from "./stores/SingleMoviesStore";
import ContextStore from "./stores/ContextStore";

let stateFileName = 'state.json';
if (isDev) {
    stateFileName = 'state.development.json'
}

storage.get(stateFileName, (error, data) => {
    if (error) throw error;

    let stores;
    if (Object.keys(data).length === 0) {
        // new
        const movieListStore = MovieListStore.create({id: "movieListStore"});
        stores = {
            root: RootStore.create({
                mylists: MyListsStore.create({movieListStore: movieListStore}),
                urlStore: UrlStore.create(),
                historyStore: HistoryStore.create(),
                singleMoviesStore: SingleMoviesStore.create({movieListStore: movieListStore}),
                movieListStore: movieListStore,
                movieIndex: IndexStore.create(),
                contextStore: ContextStore.create({lastUpdatedAt: new Date()}),
                snackMessageStore: MessageStore.create(),
            }),

        };
    } else {
        // from state file
        stores = {
            root: RootStore.create(data),
        }
    }

    // clear message
    stores.root.snackMessageStore.clear();
    stores.root.urlStore.clear();

    // save state before close
    ipcRenderer.on("app-close", (ev) => {
        stores.root.contextStore.update();
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


