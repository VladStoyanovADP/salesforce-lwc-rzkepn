export function classSetToString(classes) {
    let string = '';
    const keys = Object.keys(classes);
    for (let i = 0, { length } = keys; i < length; i += 1) {
        const key = keys[i];
        if (classes[key]) {
            string += (string.length ? ' ' : '') + key;
        }
    }
    return string;
}
