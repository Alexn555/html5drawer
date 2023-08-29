import { useEffect, useState } from "react";

export function useCardsVisualShuffle(cardItems: [], visualAmount = 6) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let counter = count;
        const interval = setInterval(() => {
          if (counter >= visualAmount) {
            clearInterval(interval);
          } else {
            setCount(count => count + 1);
            counter++;
          }
        }, 100);
        return () => clearInterval(interval); 
    }, [cardItems]);

    return count;
}
