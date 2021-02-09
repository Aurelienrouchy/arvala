export const SET_LOADING_AUTH = 'SET_LOADING_AUTH';
export const GET_LINKEDIN_USER = 'GET_LINKEDIN_USER';
export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';

export interface IUser {
	token: string,
	lname: string,
	fname: string,
	email: string,
	favorites: [ string ]
}

export interface ILinkedinUser {
	token: string,
	lname: string,
	fname: string,
	provider: string
}

interface ILoginAction {
	type: typeof LOGIN;
	payload: IUser;
}

interface IGetLinkedinUserAction {
	type: typeof GET_LINKEDIN_USER;
	payload: ILinkedinUser;
}

interface IRegisterAction {
	type: typeof REGISTER;
	payload: string;
}

interface ISetLoadingAuthAction {
	type: typeof SET_LOADING_AUTH;
	payload: boolean;
}

export type AuthAction = ILoginAction | IRegisterAction | IGetLinkedinUserAction | ISetLoadingAuthAction;

export type DispatchType = (args: AuthAction) => AuthAction;

export interface IAuthState {
    isLogin: boolean;
    userInfos: IUser | null;
}

export interface UserInput {
	lname: string;
	fname: string;
	email: string;
	token: string;
	provider: string;
}

interface ConnectOnArrivedSuccess {
	success: boolean;
	data: IUser
}

interface ConnectOnArrivedError {
	success: boolean;
	message: string;
	data: null
}

export type ConnectOnArrivedType = ConnectOnArrivedSuccess | ConnectOnArrivedError;

export interface IGetURLWithQueryParams {
    response_type: string;
    client_id: string | undefined;
    redirect_uri: string;
    state: string | undefined;
    scope: string;
}

export interface IReceiveLinkedInMessage { 
	origin: any,
	data: {
		state: any,
		code: any,
		error: any
	}
}
