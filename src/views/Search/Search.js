import React from 'react';

import './Search.scss';

import Filters from '../../components/Filters/Filters';

const Search = () => {
    return (
        <div className="search">
            <div className="title-main">Qui cherchez-vous ?</div>
            <Filters />
        </div>
    );
}

export default Search