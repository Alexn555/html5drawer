export function excludeDublicate(
    isDblEvent: boolean, 
    cb: Function, 
    restoreDblCheck: Function,
    timeout = 5000) {
    if (!isDblEvent) {
        cb();
        setTimeout(() => { restoreDblCheck(); }, timeout);
    }
}