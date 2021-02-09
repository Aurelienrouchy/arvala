import React, { useEffect, useState } from 'react';
import { capitalizeIfBold, lowercase, boldString } from '../../utils/string';

import './Select.css';

const DEFAULT_WIDTH = 300;

const Select = ({
    widht = DEFAULT_WIDTH,
    items,
    selecteds,
    setSelected,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchResults, setSearchResults] = useState(items);
    useEffect(() => {
        setIsOpen(!!inputValue);
        setSearchResults(items.filter(str => lowercase(str).includes(lowercase(inputValue))))
    }, [inputValue, items]);

    return (
        <div className="select">
            <input className="input-select" placeholder="Rechercher" type="text" value={inputValue} onChange={((evt) => setInputValue(evt.target.value))} />
            <div className="arrows" onClick={() => setIsOpen(!isOpen)}>
                <div className={`arrow arrow-left ${isOpen ? "arrow-left-is-open" : "" }`}></div>
                <div className={`dot ${isOpen ? "dot-is-open" : "" }`}></div>
                <div className={`arrow arrow-right ${isOpen ?"arrow-right-is-open" : "" }`}></div>
            </div>
            <div className={`select-drop ${isOpen ?"select-drop-is-open" : "" }`}>
                <div className="items">
                {
                    !!searchResults.length ? searchResults.map((item, index ) => (
                        <div className="item" onClick={() => onSelect(item, selecteds, setSelected)} key={index}>
                            <div className={`square ${selecteds.includes(item) ? "is-selected" : "" }`}></div> 
                            <div className="title" dangerouslySetInnerHTML={{__html: capitalizeIfBold(boldString(lowercase(item), lowercase(inputValue)))}}></div>
                        </div>
                    )) : (
                        <div className="items-no-result">Aucun resultat</div>
                    )
                }
                </div>
            </div>
        </div>
    );
}

export default Select;