import { Dispatch, SetStateAction, useEffect } from 'react';
import { receiveLinkedInMessage, signInWithLinkedin } from './../../provider/auth/fonctions';
import './AuthPopup.css';

import { queryToObject } from '../../utils/string';
import { useStore } from '../../utils/store';

interface  PropsInterface{
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function AuthPopup({ isOpen, setIsOpen }: PropsInterface) {
    const store = useStore('auth');

    useEffect(() => {
        window.addEventListener('message', receiveLinkedInMessage);
        return () => window.removeEventListener('message', receiveLinkedInMessage)
    }, []);

    useEffect(() => {
        if (window.location.search) {
            const params = queryToObject(window.location.search);
            if (params.state === process.env.REACT_APP_LINKEDIN_STATE && window.opener) {
              window.opener.postMessage(params)
            }
        }
    }, [])
    
    return (
        <div className={`auth-popup ${isOpen ? 'is-open' : ''}`} >
            <div className="background" onClick={() => setIsOpen(false)}></div>
            <div className="container">
                { store.loading && <div className="loading">Loading..</div> }
                { store.userInfos && (
                    <div className="user-infos">
                        <input type="text" value={store.userInfos.fname} />
                        <input type="text" value={store.userInfos.lname} />
                        <input type="text" value={'fdgbfh'} />
                    </div>
                )}
                <div className="button" onClick={() => signInWithLinkedin()}>connect with linkedin</div>
            </div>
        </div>
    );
}

export default AuthPopup;
    