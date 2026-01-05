import { RefObject, useEffect, useState } from "react";

export const PAPER_W = 793;
export const PAPER_H = '100%';

export function useScaleToFit(containerRef: RefObject<HTMLDivElement | null>, deps: any[] = []) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(([entry]) => {
            const { width } = entry.contentRect;
            const newScale = width / PAPER_W;
            setScale(newScale);
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    return scale;
}