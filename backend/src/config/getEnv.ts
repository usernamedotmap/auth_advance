export const getEnv = (key: string, defaultValue: string): string => {
    const value = process.env[key] || defaultValue;
    if (typeof value !== "string") {
        throw new Error(`Environment variable ${key} must be a string.`);
    }
    return value;
};