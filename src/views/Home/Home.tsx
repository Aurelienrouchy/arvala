import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { connectOnArrived } from './../../provider/auth/fonctions';
import './Home.css';
import { login } from '../../provider/auth/auth.actions';
import AuthPopup from './../../components/AuthPopup/AuthPopup';
import DecorHome from './../../components/DecorHome/DecorHome';

function Home() {
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function() {
            setLoading(true)
            const res = await connectOnArrived();
            
            if (res.success && res.data) {
                dispatch(login(res.data))
            }
            
            setLoading(false)
        })();
    }, [dispatch]);
    
    return (
        <div className="home">
            { loading && <div className="loading">LOADIN...</div>}
            <AuthPopup isOpen={openPopup} setIsOpen={setOpenPopup} />
            <div className="logo">LOGO</div>
            <div className="main">
                <div className="infos-container">
                    <div className="title">I'm the title</div>
                    <div className="paragraphe">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est fugit id laboriosam soluta vel culpa repellendus ducimus doloribus. Consequatur tenetur neque delectus, eos nobis a voluptatibus ab commodi! Hic, suscipit.</div>
                    <div className="button" onClick={() => setOpenPopup(true)}>Let's go</div>
                </div>
                <DecorHome />
            </div>
        </div>
    );
}

export default Home;
