import { IReceiveLinkedInMessage, ConnectOnArrivedType, IGetURLWithQueryParams } from './auth.type';
import { encrypt, decrypt } from './../../utils/crypto';
import { client } from '../../apollo/client';
import { GET_USER_BY_TOKEN } from '../../apollo/query';
import { store } from '../../utils/store';
import { setLoadingAuth, getLinkedinUser } from './auth.actions';
import { REGISTER } from '../../apollo/mutation';

let popup: Window | any;


export const getLinkedinUrl = (): string => {
    const BASE_URL = 'https://www.linkedin.com/oauth/v2/authorization';
    const REDIRECT_URI = 'http://localhost:3000/';
    const SCOPE = 'r_liteprofile r_emailaddress';
    const RESPONSE_TYPE = 'code';

    const getURLWithQueryParams = (base: string, params: IGetURLWithQueryParams) => {
        const query = Object
            .entries(params)
            .map(([key, value = '']) => `${key}=${encodeURIComponent(value)}`)
            .join('&')
          
        return `${base}?${query}`
    }
    
    return getURLWithQueryParams(BASE_URL, {
        response_type: RESPONSE_TYPE,
        client_id: process.env.REACT_APP_LINKEDIN_ID,
        redirect_uri: REDIRECT_URI,
        state: process.env.REACT_APP_LINKEDIN_STATE,
        scope: SCOPE
    });
}

export const receiveLinkedInMessage = async ({ origin, data: { state, code, error, ...rest} }: IReceiveLinkedInMessage) => {
    try {
        store.dispatch(setLoadingAuth(true))
        if (origin !== window.location.origin || state !== process.env.REACT_APP_LINKEDIN_STATE) return
        
        popup.close();
        
        if (code) {
            const { data } = await client.mutate({
                mutation: REGISTER,
                variables: {
                    token: code
                }
            });
            const user = data?.registerLinkedinUser;

            store.dispatch(getLinkedinUser(user))
            
        } else if (error && !['user_cancelled_login', 'user_cancelled_authorize'].includes(error)) {
            // setCodeLkd(error)
        }
        
        store.dispatch(setLoadingAuth(false))
    } catch (err) {
        store.dispatch(setLoadingAuth(false))
    }
}

export const signInWithLinkedin = () => {
    popup = openWindow(getLinkedinUrl());
}

export const openWindow = (url: string) => window.open(url, '_blank', 'width=600,height=600');

export const getLocalToken = (): string | undefined => {
    const encryptToken = localStorage.getItem('arvala-token');

    if (!encryptToken) {
        return
    }
    
    return decrypt(encryptToken) || undefined;
}

export const setLocalToken = (token: string) => localStorage.setItem('arvala-token', encrypt(token));

export const connectOnArrived = async (): Promise<ConnectOnArrivedType> => {
    try {
        const token = getLocalToken();

        if (!token) {
            return {
                success: false,
                message: 'Token not found',
                data: null
            }
        }

        const { data } = await client.query({
            query: GET_USER_BY_TOKEN,
            variables: {
                token
            }
        });

        return {
            success: true,
            data
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
            data: null
        }
    }
}