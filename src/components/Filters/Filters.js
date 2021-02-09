import React, { useState } from 'react';
import Select from '../Select/Select';
import { lowercase } from '../../utils/string';

import './Filters.css';

const JOBS = ['fron-end', 'CEO', 'CTO', 'back-end', 'marketing leader'];
const LOCATIONS = ['Paris', 'Creteil', 'Marseille', 'Lyon', 'Besancon', 'Yerres', 'illinois', 'porpoe', 'Paris 4eme', 'paris 5eme', 'tokyo', 'seoul', 'lima', 'bretagne', 'barcelone', 'madrid'];

const Filters = () => {
    const [allJobs, setAllJobs] = useState(JOBS);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [allLocations, setAllLocations] = useState(LOCATIONS);
    const [selectedLocations, setSelectedLocations] = useState([]);

    const addOrRemove = (val, arr, setter) => setter(arr.includes(val) ? arr.filter(item => val !== item) : [...arr, val])

    return (
        <div className="filters">
            <div className="filters-content">
                <Select 
                    items={allJobs}
                    selecteds={selectedJobs}
                    setSelected={setSelectedJobs}
                    onSelect={addOrRemove} />
                <Select 
                    items={allLocations}
                    selecteds={selectedLocations}
                    setSelected={setSelectedLocations}
                    onSelect={addOrRemove} />
                <div className="filters-more">+ filtres</div>
            </div>
            <div className="count">
                <div className="count-number">{2345}</div>
                <div className="count-title">resultats</div>
            </div>
        </div>
    );
}

export default Filters;