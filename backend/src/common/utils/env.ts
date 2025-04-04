export const getEnv = (key: string, defaultValue: string): string => {
    const value = process.env[key];

    if (value === undefined) {
        if (defaultValue) {
            return defaultValue
        }
        throw new Error(`Environment varibale ${key} is not defined`);
    }
    return value;

};