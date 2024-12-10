
export const generateId = (): string => {
    const timestamp: string = Date.now().toString(16);
    const randomString: string = crypto.randomUUID();
    const uniqueId: string = (randomString + timestamp).slice(-23);
    return uniqueId;
}
