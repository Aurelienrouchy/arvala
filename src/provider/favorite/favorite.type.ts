export const GET_FAVORITES = 'GET_FAVORITES';
export const SET_FAVORITE = 'SET_FAVORITE';
export const UPDATE_FAVORITE = 'UPDATE_FAVORITE';
export const BUY_FAVORITE = 'BUY_FAVORITE';

interface GetFavoritesAction {
  type: typeof GET_FAVORITES,
  payload: string
}

interface SetFavoritesAction {
  type: typeof SET_FAVORITE,
  payload: string
}

interface UpdateFavoritesAction {
  type: typeof UPDATE_FAVORITE,
  payload: object
}

interface BuyFavoritesAction {
  type: typeof BUY_FAVORITE,
  payload: string
}

export type FavoriteActionType = GetFavoritesAction | SetFavoritesAction | UpdateFavoritesAction | BuyFavoritesAction;

export interface FavoritesStateType {
    favorites: []
}