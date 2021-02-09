import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk"
import { useSelector } from 'react-redux';

import { AuthReducer } from "../provider/auth/auth.reducer";
import { IAuthState } from '../provider/auth/auth.type';
import { FavoritesStateType } from '../provider/favorite/favorite.type';
import { FavoriteReducer } from "../provider/favorite/favorite.reducer";

export const allReducers = combineReducers({
    auth: AuthReducer,
    favorites: FavoriteReducer
});

export interface GlobalStoreType {
    auth: IAuthState;
    favorite: FavoritesStateType
}

type StoreName = 'auth' | 'favorite';
type StoreType = IAuthState | FavoritesStateType | any;

export const useStore: StoreType = (store: StoreName) => useSelector((state: GlobalStoreType) => state[store]);

export const store = createStore(allReducers, applyMiddleware(thunk));
