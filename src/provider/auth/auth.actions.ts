import { REGISTER, LOGIN, IUser, ILinkedinUser, GET_LINKEDIN_USER, SET_LOADING_AUTH } from './auth.type';
import { store } from './../../utils/store';

export const getLinkedinUser = (user: ILinkedinUser) => store.dispatch({
	type: GET_LINKEDIN_USER,
	payload: user,
})

export const setLoadingAuth = (loading: boolean) => store.dispatch({
	type: SET_LOADING_AUTH,
	payload: loading,
})

export const register = (token: string) => store.dispatch({
	type: REGISTER,
	payload: token,
})

export const login = (user: IUser) => store.dispatch({
	type: LOGIN,
	payload: user,
})


