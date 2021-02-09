import { useMemo, useEffect, useState } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import { randomIntFromInterval } from '../../utils/number';
import './DecorHome.css';
import SquareDeco from './../SquareDeco/SquareDeco';


function DecorHome() {
    const size = useWindowSize();
    const [position, setPosition] = useState({x: 0, y: 0});

    const addEventListeners = () => {
        document.addEventListener("mousemove", onMouseMove);
    };

    const removeEventListeners = () => {
        document.removeEventListener("mousemove", onMouseMove);
    };

    const onMouseMove = (e: MouseEvent) => {
        setPosition({x: e.clientX, y: e.clientY});
    };

    useEffect(() => {
        addEventListeners();
        return () => removeEventListeners();
    });
     
    const {
        nbDecoOnHeight,
        squareDecoSelected
    } = useMemo(() => {
        const nbDecoOnHeight = Math.round(size.height / ( size.width / 20 ));
        const squareDecoSelected = Array(nbDecoOnHeight).fill(0).map(() => randomIntFromInterval(0, nbDecoOnHeight * 10))

        return {
            squareDecoSelected,
            nbDecoOnHeight
        }
    }, [size.height, size.width])

    return (
        <div className="decor-home">
            <div className="selector" style={{transform: `translate(${position.x}px, ${position.y}px)`}}></div>
            {Array(nbDecoOnHeight * 10).fill(0).map((n, i) => <SquareDeco i={i} isAnimated={squareDecoSelected.includes(i)} />)}
        </div>
    );
}

export default DecorHome;