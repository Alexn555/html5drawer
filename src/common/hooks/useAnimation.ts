import { useEffect, useRef } from "react";

export const useAnimationFrame = (callback: Function) => {
    const requestRef = useRef<number>(0);
    const animate = () => {
        callback();
        requestRef.current = requestAnimationFrame(animate);
    };
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};