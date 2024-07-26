function classNamesHash(hash, classes) {
    if (typeof classes === 'string') {
        const array = classes.trim().split(/\s+/);
        for (let i = 0, { length } = array; i < length; i += 1) {
            hash[array[i]] = true;
        }
        return hash;
    }
    return Object.assign(hash, classes);
}

const proto = {
    add(className) {
        return classNamesHash(this, className);
    },
    invert() {
        const keys = Object.keys(this);
        for (let i = 0, { length } = keys; i < length; i += 1) {
            const key = keys[i];
            this[key] = !this[key];
        }
        return this;
    },
    toString() {
        let string = '';
        const keys = Object.keys(this);
        for (let i = 0, { length } = keys; i < length; i += 1) {
            const key = keys[i];
            if (this[key]) {
                string += (string.length ? ' ' : '') + key;
            }
        }
        return string;
    },
};

export function classSet(config) {
    return classNamesHash({ __proto__: proto }, config);
}
