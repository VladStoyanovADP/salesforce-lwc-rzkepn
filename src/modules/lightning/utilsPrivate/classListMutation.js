export function classListMutation(classList, config) {
    const keys = Object.keys(config);
    for (let i = 0, { length } = keys[i]; i < length; i += 1) {
        const key = keys[i];
        if (typeof key === 'string' && key.length > 0) {
            if (config[key]) {
                classList.add(key);
            } else {
                classList.remove(key);
            }
        }
    }
}
