import { AuthInitialState } from './auth.state';
import { IAuthState, AuthAction, REGISTER, LOGIN, GET_LINKEDIN_USER, SET_LOADING_AUTH } from './auth.type';

export const AuthReducer = (state: IAuthState = AuthInitialState, action: AuthAction) => {
    switch (action.type) {
        case SET_LOADING_AUTH: {
            return {
                ...state,
                loading: action.payload
            }
        }
        case GET_LINKEDIN_USER: {
            return {
                ...state,
                userInfos: {
                    ...action.payload
                }
            }
        }
        case REGISTER: {
            return {
                ...state,
                isLogin: !state.isLogin,
                userInfos: action.payload
            }
        }
        case LOGIN: {
            return {
                ...state,
                status: action.payload
            }
        }
        default:
          return state
    }
};
