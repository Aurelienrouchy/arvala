import { FavoritesState } from './favorite.state';
import { 
    SET_FAVORITE,
    UPDATE_FAVORITE,
    BUY_FAVORITE,
    GET_FAVORITES,
    FavoritesStateType,
    FavoriteActionType
} from './favorite.type';

export const FavoriteReducer = (state: FavoritesStateType = FavoritesState, action: FavoriteActionType) => {
    switch (action.type) {
        case GET_FAVORITES: {
            return {
                ...state,
                status: action.payload
            }
        }
        case SET_FAVORITE: {
            return {
                ...state,
                status: action.payload
            }
        }
        case UPDATE_FAVORITE: {
            return {
                ...state,
                status: action.payload
            }
        }
        case BUY_FAVORITE: {
            return {
                ...state,
                status: action.payload
            }
        }
        default:
          return state
    }
};

