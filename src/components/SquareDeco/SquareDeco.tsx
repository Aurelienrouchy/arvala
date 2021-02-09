import { useMemo } from 'react';
import './SquareDeco.css';

interface SquareDecoInterface {
    isAnimated: boolean
    i: number
}

function SquareDeco({ isAnimated, i }: SquareDecoInterface) {
    const { delay } = useMemo(() => ({delay: Math.random() * 100}), [])
    return (
        <div className={`square-deco is-animated`} style={{animationDelay: delay + 's'}}></div>
    );
}

export default SquareDeco;
