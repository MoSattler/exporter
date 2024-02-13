export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const randomDelay = (min: number = 5000, max: number = 15000) => {
    return delay(getRandomNumber(min, max));
}