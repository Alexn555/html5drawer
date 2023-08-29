export function getCount(counter: number = 0, amout = 6) {
    const interval = setInterval(() => {
        if (counter >= amout) {
            clearInterval(interval);
        } else {
            counter++;
        }
    }, 100);
    return counter;
}

export function decimalConvert(percent: number) {
    return percent > 0 ? percent / 100 : 0;
}

export function getRandomInt(min = 0, max = 1000) {
    return Math.random() * (max - min) + min;
}

export function deductFromStack(stack: number, value: number): number {
    return stack > value ? stack - value : 0;
}
