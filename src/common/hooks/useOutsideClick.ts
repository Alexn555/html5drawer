import { RefObject } from "react";

export function listenForOutsideClicks(
    listening: boolean,
    setListening: Function, 
    divRef: RefObject<HTMLDivElement>,
    setIsOpen: Function) {
    return () => {
      if (listening) return;
      if (!divRef?.current) return;
      setListening(true);
      [`click`, `touchstart`].forEach((type) => {
        document.addEventListener(`click`, (evt: any) => {
          if (divRef?.current &&
             divRef?.current.contains(evt.target)) { 
            return; 
          }
          setIsOpen(false);
        });
      });
    }
  }