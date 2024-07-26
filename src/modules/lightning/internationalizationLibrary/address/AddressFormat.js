// This is a library built from Globalization's repo
// https://git.soma.salesforce.com/Globalization/address.js
// For new versions, copy AddressFormat.js from node_modules/address.js/dist/AddressFormat.js
// And add "export { address };" at the end.
// If the node modules file doesn't reflect the current code in the address.js github repo linked above,
// then manually generate the AddressFormat.js file from the above globalization repo following the steps in its readMe

/* eslint-disable */
function _toPrimitive(t, r) {
    if ('object' != typeof t || !t) return t;
    let e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        let i = e.call(t, r || 'default');
        if ('object' != typeof i) return i;
        throw new TypeError('@@toPrimitive must return a primitive value.');
    }
    return ('string' === r ? String : Number)(t);
}
function _toPropertyKey(t) {
    let i = _toPrimitive(t, 'string');
    return 'symbol' == typeof i ? i : String(i);
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
function _defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
        let descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, 'prototype', {
        writable: false,
    });
    return Constructor;
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
    let n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === 'Object' && o.constructor) n = o.constructor.name;
    if (n === 'Map' || n === 'Set') return Array.from(o);
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator'];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
            if (it) o = it;
            let i = 0;
            let F = function() {};
            return {
                s: F,
                n: function() {
                    if (i >= o.length) {
                        return {
                            done: true,
                        };
                    }
                    return {
                        done: false,
                        value: o[i++],
                    };
                },
                e: function(e) {
                    throw e;
                },
                f: F,
            };
        }
        throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
    }
    let normalCompletion = true;
    let didErr = false;
    let err;
    return {
        s: function() {
            it = it.call(o);
        },
        n: function() {
            let step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function(e) {
            didErr = true;
            err = e;
        },
        f: function() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally {
                if (didErr) throw err;
            }
        },
    };
}
let data = {
    AE: {
        fmt: '%A%n%S%n%K',
        require: 'ASK',
        input: 'ASK',
    },
    AL: {
        fmt: '%A%n%Z%n%C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    EC: {
        _ref: 'AL',
    },
    MU: {
        _ref: 'AL',
    },
    OM: {
        _ref: 'AL',
    },
    AM: {
        fmt: '%A%n%Z%n%C%n%S%n%K',
        require: 'AZK',
        input: 'AZK',
    },
    AR: {
        fmt: '%A%n%Z %C%n%S%n%K',
        require: 'AZCSK',
        input: 'AZCSK',
    },
    CL: {
        _ref: 'AR',
    },
    CV: {
        _ref: 'AR',
    },
    MY: {
        _ref: 'AR',
    },
    UZ: {
        _ref: 'AR',
    },
    AT: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    BA: {
        _ref: 'AT',
    },
    BG: {
        _ref: 'AT',
    },
    CH: {
        _ref: 'AT',
    },
    CY: {
        _ref: 'AT',
    },
    DE: {
        _ref: 'AT',
    },
    DK: {
        _ref: 'AT',
    },
    DO: {
        _ref: 'AT',
    },
    DZ: {
        _ref: 'AT',
    },
    EE: {
        _ref: 'AT',
    },
    ET: {
        _ref: 'AT',
    },
    FR: {
        _ref: 'AT',
    },
    GE: {
        _ref: 'AT',
    },
    GL: {
        _ref: 'AT',
    },
    GR: {
        _ref: 'AT',
    },
    IL: {
        _ref: 'AT',
    },
    KW: {
        _ref: 'AT',
    },
    LA: {
        _ref: 'AT',
    },
    LR: {
        _ref: 'AT',
    },
    IS: {
        _ref: 'AT',
    },
    MA: {
        _ref: 'AT',
    },
    MG: {
        _ref: 'AT',
    },
    MK: {
        _ref: 'AT',
    },
    MZ: {
        _ref: 'AT',
    },
    NL: {
        _ref: 'AT',
    },
    NO: {
        _ref: 'AT',
    },
    PL: {
        _ref: 'AT',
    },
    PT: {
        _ref: 'AT',
    },
    PY: {
        _ref: 'AT',
    },
    RO: {
        _ref: 'AT',
    },
    RS: {
        _ref: 'AT',
    },
    SK: {
        _ref: 'AT',
    },
    TJ: {
        _ref: 'AT',
    },
    TN: {
        _ref: 'AT',
    },
    TZ: {
        _ref: 'AT',
    },
    WF: {
        _ref: 'AT',
    },
    AU: {
        fmt: '%A%n%C %S %Z%n%K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    CA: {
        _ref: 'AU',
    },
    AZ: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    AF: {
        fmt: '%A%n%C%n%Z%n%K',
        require: 'ACZK',
        input: 'ACZK',
    },
    FK: {
        _ref: 'AF',
    },
    GB: {
        fmt: '%A%n%C%n%S%n%Z%n%K',
        require: 'ACZK',
        input: 'ACSZK',
    },
    KE: {
        _ref: 'AF',
    },
    LK: {
        _ref: 'AF',
    },
    ZA: {
        _ref: 'AF',
    },
    SH: {
        _ref: 'AF',
    },
    SZ: {
        _ref: 'AF',
    },
    US: {
        fmt: '%A%n%C, %S %Z%n%K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    BB: {
        _ref: 'US',
    },
    BS: {
        _ref: 'US',
    },
    SO: {
        _ref: 'US',
    },
    ES: {
        fmt: '%A%n%Z %C %S%n%K',
        require: 'AZCSK',
        input: 'AZCSK',
    },
    IT: {
        _ref: 'ES',
    },
    UY: {
        _ref: 'ES',
    },
    ID: {
        fmt: '%A%n%C%n%S %Z%n%K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    IE: {
        _ref: 'ID',
    },
    TH: {
        _ref: 'ID',
    },
    VN: {
        _ref: 'ID',
    },
    HU: {
        fmt: '%C%n%A%n%Z%n%K',
        require: 'CAZK',
        input: 'CAZK',
    },
    BH: {
        fmt: '%A%n%C %Z%n%K',
        require: 'ACZK',
        input: 'ACZK',
    },
    BM: {
        _ref: 'BH',
    },
    BN: {
        _ref: 'BH',
    },
    BT: {
        _ref: 'BH',
    },
    KH: {
        _ref: 'BH',
    },
    LB: {
        _ref: 'BH',
    },
    JO: {
        _ref: 'BH',
    },
    MT: {
        _ref: 'BH',
    },
    NP: {
        _ref: 'BH',
    },
    NZ: {
        _ref: 'BH',
    },
    SA: {
        _ref: 'BH',
    },
    BD: {
        fmt: '%A%n%C - %Z%n%K',
        require: 'ACZK',
        input: 'ACZK',
    },
    BR: {
        fmt: '%A%n%C-%S%n%Z%n%K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    CN: {
        fmt: '%K%n%S %C%n%A%n%Z',
        require: 'KCAZ',
        input: 'KSCAZ',
    },
    HK: {
        fmt: '%K%S%C%n%A%n%Z',
        require: 'KCA',
        input: 'KSCAZ',
    },
    CO: {
        fmt: '%A%n%C, %S, %Z%n%K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    CR: {
        fmt: '%A%n%S, %C%n%Z%n%K',
        require: 'ACSZK',
        input: 'ASCZK',
    },
    EG: {
        fmt: '%A%n%C%n%S%n%Z%n%K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    RU: {
        _ref: 'EG',
    },
    UA: {
        _ref: 'EG',
    },
    FI: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    GT: {
        fmt: '%A%n%Z-%C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    HN: {
        fmt: '%A%n%C, %S%n%Z%n%K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    IQ: {
        _ref: 'HN',
    },
    HR: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    HT: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    IN: {
        fmt: '%A%n%C %Z%n%S%n%K',
        require: 'ACZSK',
        input: 'ACZSK',
    },
    NG: {
        _ref: 'IN',
    },
    PE: {
        _ref: 'IN',
    },
    IR: {
        fmt: '%S%n%C%n%A%n%Z%n%K',
        require: 'SCAZK',
        input: 'SCAZK',
    },
    JM: {
        fmt: '%A%n%C%n%S%n%K',
        require: 'ACSK',
        input: 'ACSK',
    },
    PA: {
        _ref: 'JM',
    },
    SC: {
        _ref: 'JM',
    },
    SR: {
        _ref: 'JM',
    },
    JP: {
        fmt: '%K%n〒%Z%n%S %C%n%A',
        require: 'KZCA',
        input: 'KZSCA',
    },
    EN_JP: {
        fmt: '%A%n%C %S%n%Z %K',
        require: 'ACSZK',
        input: 'ACSZK',
    },
    KG: {
        fmt: '%Z %C%n%A%n%S%n%K',
        require: 'ZCAK',
        input: 'ZCAK',
    },
    KR: {
        fmt: '%S %C%n%A%n%Z%n%K',
        require: 'SCAZK',
        input: 'SCAZK',
    },
    KY: {
        fmt: '%A%n%S %Z%n%K',
        require: 'ASZK',
        input: 'ASZK',
    },
    KZ: {
        fmt: '%Z%n%S%n%C%n%A%n%K',
        require: 'ZSCAK',
        input: 'ZSCAK',
    },
    LT: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    LV: {
        fmt: '%A%n%C, %Z%n%K',
        require: 'ACZK',
        input: 'ACZK',
    },
    MM: {
        _ref: 'LV',
    },
    MC: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    MD: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    MW: {
        fmt: '%A%n%C%n%K',
        require: 'ACK',
        input: 'ACK',
    },
    MX: {
        fmt: '%A%n%Z %C, %S%n%K',
        require: 'AZCSK',
        input: 'AZCSK',
    },
    NI: {
        fmt: '%A%n%Z%n%C, %S%n%K',
        require: 'AZCSK',
        input: 'AZCSK',
    },
    PG: {
        fmt: '%A%n%C %Z %S%n%K',
        require: 'ACZSK',
        input: 'ACZSK',
    },
    PH: {
        fmt: '%A, %C%n%Z %S%n%K',
        require: 'ACZSK',
        input: 'ACZSK',
    },
    PK: {
        fmt: '%A%n%C-%Z%n%K',
        require: 'ACZK',
        input: 'ACZK',
    },
    PR: {
        fmt: '%A%n%C %Z%n%K',
        require: 'ACZK',
        input: 'ACZK',
    },
    SE: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    SG: {
        fmt: '%A%n%C %Z%n%S%n%K',
        require: 'AZK',
        input: 'AZK',
    },
    SI: {
        fmt: '%A%n%Z %C%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    SV: {
        fmt: '%A%n%Z-%C%n%S%n%K',
        require: 'AZCSK',
        input: 'AZCSK',
    },
    TR: {
        fmt: '%A%n%Z %C/%S%n%K',
        require: 'AZCK',
        input: 'AZCK',
    },
    TW: {
        fmt: '%K%n%Z%n%S %C%n%A',
        require: 'KZSCA',
        input: 'KZSCA',
    },
    VE: {
        fmt: '%A%n%C %Z, %S%n%K',
        require: 'ACZSK',
        input: 'ACZSK',
    },
};
let languageCodeToCountry = {
    languageCode: {
        'af': 'ZA',
        'am': 'ET',
        'ar': 'AE',
        'bg': 'BG',
        'bn': 'BD',
        'bs': 'BA',
        'ca': 'ES',
        'cs': 'CZ',
        'cy': 'GB',
        'da': 'DK',
        'de': 'DE',
        'el': 'GR',
        'es': 'ES',
        'et': 'EE',
        'eu': 'ES',
        'fa': 'IR',
        'fi': 'FI',
        'fr': 'FR',
        'ga': 'IE',
        'gu': 'IN',
        'haw': 'US',
        'hi': 'IN',
        'hmn': 'US',
        'hr': 'HR',
        'ht': 'HT',
        'hu': 'HU',
        'hy': 'AM',
        'in': 'ID',
        'is': 'IS',
        'it': 'IT',
        'iw': 'IL',
        'ja': 'JP',
        'ji': 'IL',
        'ka': 'GE',
        'kk': 'KZ',
        'kl': 'GL',
        'km': 'KH',
        'kn': 'IN',
        'ko': 'KR',
        'lb': 'LU',
        'lt': 'LT',
        'lv': 'LV',
        'mi': 'NZ',
        'mk': 'MK',
        'ml': 'IN',
        'mr': 'IN',
        'ms': 'MY',
        'mt': 'MT',
        'my': 'MM',
        'nl': 'NL',
        'no': 'NO',
        'pa': 'IN',
        'pl': 'PL',
        'pt': 'PT',
        'rm': 'CH',
        'ro': 'RO',
        'ru': 'RU',
        'sh': 'RS',
        'sk': 'SK',
        'sl': 'SL',
        'sm': 'WS',
        'sq': 'AL',
        'sr': 'RS',
        'sv': 'SE',
        'sw': 'ZA',
        'ta': 'IN',
        'te': 'IN',
        'th': 'TH',
        'tl': 'PH',
        'tr': 'TR',
        'uk': 'UA',
        'ur': 'IN',
        'vi': 'VN',
        'xh': 'ZA',
        'zh': 'CN',
        'zu': 'ZA',
    },
};

/**
     * Define address format patterns.
     */
var AddressFormatPattern = Object.freeze({
    /**
     *
     * N: Name (The formatting of names for this field is outside of the scope of the address elements.)
     * O: Organization
     * A: Address Lines (2 or 3 lines address)
     * D: District (Sub-locality): smaller than a city, and could be a neighborhood, suburb or dependent locality.
     * C: City (Locality)
     * S: State (Administrative Area)
     * K: Country
     * Z: ZIP Code / Postal Code
     * X: Sorting code, for example, CEDEX as used in France
     * n: newline
     */
    A: Symbol('Address Lines'),
    C: Symbol('City'),
    S: Symbol('State'),
    K: Symbol('Country'),
    Z: Symbol('Zip Code'),
    n: Symbol('New Line'),
    fromPlaceHolder: function fromPlaceHolder(placeHolder) {
        switch (placeHolder) {
        case 'A':
            return AddressFormatPattern.A;
        case 'C':
            return AddressFormatPattern.C;
        case 'S':
            return AddressFormatPattern.S;
        case 'K':
            return AddressFormatPattern.K;
        case 'Z':
            return AddressFormatPattern.Z;
        case 'n':
            return AddressFormatPattern.n;
        }
        return null;
    },
    getPlaceHolder: function getPlaceHolder(pattern) {
        switch (pattern) {
        case AddressFormatPattern.A:
            return 'A';
        case AddressFormatPattern.C:
            return 'C';
        case AddressFormatPattern.S:
            return 'S';
        case AddressFormatPattern.K:
            return 'K';
        case AddressFormatPattern.Z:
            return 'Z';
        case AddressFormatPattern.n:
            return 'n';
        }
        return null;
    },
    getData: function getData(pattern, data) {
        if (data) {
            switch (pattern) {
            case AddressFormatPattern.A:
                return data.address;
            case AddressFormatPattern.C:
                return data.city;
            case AddressFormatPattern.S:
                return data.state;
            case AddressFormatPattern.K:
                return data.country;
            case AddressFormatPattern.Z:
                return data.zipCode;
            case AddressFormatPattern.n:
                return data.newLine;
            }
        }
        return null;
    },
});

/**
     * Address token types enum
     *
     * @private
     */
let AddressTokenTypes = Object.freeze({
    DATA: Symbol('data'),
    STRING: Symbol('string'),
    NEWLINE: Symbol('newline'),
    GROUP: Symbol('group'),
});

/**
     * AddressToken class
     *
     * @private
     */
let AddressToken = /* #__PURE__*/function() {
    /**
     *
     * @param {AddressTokenTypes} type
     * @param {string} string
     * @param {*} pattern
     */
    function AddressToken(type, string, pattern) {
        _classCallCheck(this, AddressToken);
        this.type = type;
        this.string = string;
        this.pattern = pattern;
    }

    /**
     * Construct a string type token
     *
     * @param {string} string String
     * @return {AddressToken} Address Token
     */
    _createClass(AddressToken, null, [{
        key: 'string',
        value: function string(_string) {
            return new AddressToken(AddressTokenTypes.STRING, _string);
        },
        /**
         * Construct a data type token
         *
         * @param {pattern} pattern Address Format Pattern
         * @return {AddressToken} Address Token
         */
    }, {
        key: 'data',
        value: function data(pattern) {
            return new AddressToken(AddressTokenTypes.DATA, undefined, pattern);
        },
        /**
         * Construct a new line type token
         *
         * @return {AddressToken} Address Token
         */
    }, {
        key: 'newLine',
        value: function newLine() {
            return new AddressToken(AddressTokenTypes.NEWLINE);
        },
    }]);
    return AddressToken;
}();
    /**
     * TokenizerState class
     *
     * @private
     */
let TokenizerState = /* #__PURE__*/_createClass(
    /**
     * Constructor
     *
     * @param {string} pattern
     * @param {int} start
     */
    function TokenizerState(pattern, start) {
        _classCallCheck(this, TokenizerState);
        this.pattern = pattern;
        this.start = start;
    });
    /**
     * Tokenize string pattern to AddressToken array
     *
     * @param {TokenizerState} state
     * @param {AddressToken[]} tokens
     * @return {TokenizerState} Tokenizer state
     *
     * @private
     */
function tokenize(state, tokens) {
    let nextIndex = state.start;
    if (state.pattern) {
        let len = state.pattern.length;
        while (state.start < len) {
            nextIndex = state.pattern.indexOf('%', nextIndex);
            if (nextIndex >= 0 && nextIndex + 1 < len) {
                let placeHolder = state.pattern.substring(nextIndex + 1, nextIndex + 2);
                switch (placeHolder) {
                case 'n':
                {
                    if (nextIndex - state.start > 0) {
                        tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
                    }
                    tokens.push(AddressToken.newLine());
                    state.start = nextIndex + 2;
                    nextIndex = state.start;
                    break;
                }
                default:
                {
                    let p = AddressFormatPattern.fromPlaceHolder(placeHolder);
                    if (p) {
                        if (nextIndex - state.start > 0) {
                            tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
                        }
                        tokens.push(AddressToken.data(p));
                        state.start = nextIndex + 2;
                        nextIndex = state.start;
                    } else {
                        state.start = nextIndex + 2;
                        nextIndex = state.start;
                    }
                    break;
                }
                }
            } else {
                if (state.start < len) {
                    tokens.push(AddressToken.string(state.pattern.substring(state.start)));
                }
                state.start = len;
            }
        }
    }
    return state;
}

/**
     * Format line from tokens
     *
     * @param {*} tokens
     * @param {*} data
     * @param {*} ignoreEmptyLines
     * @param {*} firstIndex
     * @param {*} lastIndex
     * @return {string} Formatted line
     *
     * @private
     */
function formatLineTokens(tokens, data, ignoreEmptyLines, firstIndex, lastIndex) {
    let parts = [];
    for (let index = firstIndex; index <= lastIndex; index++) {
        let token = tokens[index];
        if (!token) {
            continue;
        } else if (token.type == AddressTokenTypes.DATA) {
        // Consume all subsequent data if available
            let dataBuffer = '';
            let lastDataIndex = index;
            for (let dataIndex = index; dataIndex <= lastIndex; dataIndex++) {
                let dataToken = tokens[dataIndex];
                if (!dataToken || dataToken.type != AddressTokenTypes.DATA) {
                    break;
                }
                let fieldData = AddressFormatPattern.getData(dataToken.pattern, data);
                if (fieldData) {
                    dataBuffer += fieldData;
                    lastDataIndex = dataIndex;
                }
            }
            let hasData = dataBuffer && dataBuffer.length > 0;
            // Output previous string only if there is data before it,
            // or if it is the first on the line
            let hasPreviousData = false;
            if (index - 1 >= firstIndex) {
                let stringToken = tokens[index - 1];
                if (stringToken && stringToken.type == AddressTokenTypes.STRING && stringToken.string) {
                    for (let prevIndex = index - 2; prevIndex >= firstIndex; prevIndex--) {
                        let prevToken = tokens[prevIndex];
                        if (prevToken && prevToken.type == AddressTokenTypes.DATA) {
                            let _fieldData = AddressFormatPattern.getData(prevToken.pattern, data);
                            if (_fieldData) {
                                hasPreviousData = true;
                                break;
                            }
                        } else if (prevToken && prevToken.type == AddressTokenTypes.STRING) {
                            // ie. for "%C, %S %Z" without S -> "City, 95100"
                            // Comment this if we want "City 95100" instead
                            // (use the separator between S Z instead of C S)
                            stringToken = prevToken;
                        }
                    }
                    if (!ignoreEmptyLines || hasPreviousData && hasData || index - 1 == firstIndex && hasData) {
                        parts.push(stringToken.string);
                    }
                }
            }
            if (hasData) {
                parts.push(dataBuffer);
            }
            index = lastDataIndex;
            // Output next string only if it is the last
            // and there is previous data before it
            if (index + 1 == lastIndex) {
                let _stringToken = tokens[index + 1];
                if (_stringToken && _stringToken.type == AddressTokenTypes.STRING && _stringToken.string) {
                    if (!ignoreEmptyLines || hasData || hasPreviousData) {
                        parts.push(_stringToken.string);
                    }
                }
                // Consume the last string token
                index = index + 1;
            }
        } else ;
    }
    return parts.join('').trim();
}

/**
     * Tokenize address format pattern.
     *
     * @param {AddressToken[]} tokens
     * @param {*} data
     * @param {string} lineBreak
     * @param {boolean} ignoreEmptyLines
     * @return {string} Formatted Address
     *
     * @private
     */
function formatTokens(tokens, data, lineBreak, ignoreEmptyLines) {
    let lines = [];
    let lineIndex = -1;
    for (let index = 0; index < tokens.length; index++) {
        let doFormat = false;
        let endWithNewLine = false;
        let token = tokens[index];
        switch (token.type) {
        case AddressTokenTypes.NEWLINE:
        {
            if (lineIndex >= 0) {
                doFormat = true;
                endWithNewLine = true;
            } else if (!ignoreEmptyLines) {
                lines.push(''); // Empty line
                // If the pattern ends with a newline
                if (index + 1 == tokens.length) {
                    lines.push(''); // Empty line
                }
            }
            break;
        }
        default:
        {
            lineIndex = lineIndex < 0 ? index : lineIndex;
            doFormat = index + 1 == tokens.length ? true : doFormat;
            break;
        }
        }
        if (doFormat) {
            let line = formatLineTokens(tokens, data, ignoreEmptyLines, lineIndex, endWithNewLine ? index - 1 : index);
            if (!ignoreEmptyLines || line) {
                lines.push(line);
            }
            // If line ends with a newline, and it is the last line on pattern
            if (!ignoreEmptyLines && endWithNewLine && index + 1 == tokens.length) {
                lines.push('');
            }
            lineIndex = -1;
        }
    }
    return lines.join(lineBreak);
}

/**
     * Format address data.
     *
     * @param {*} data Address data being processed.
     * @param {string} pattern Address format pattern.
     * @param {string} lineBreak Line break string to use
     * @param {boolean} ignoreEmptyLines Ignore lines that has no or empty data to replace.
     * @return {string} Formatted address.
     */
function format(data, pattern, lineBreak, ignoreEmptyLines) {
    // TODO: support escapeHtml to match Java class feature parity
    ignoreEmptyLines = ignoreEmptyLines === false ? false : true; // Defaults to false
    lineBreak = lineBreak || '\n'; // Defaults to <br/> or lf
    let tokens = [];
    tokenize(new TokenizerState(pattern, 0), tokens);
    return formatTokens(tokens, data, lineBreak, ignoreEmptyLines);
}
let addressFormatter = {
    format: format,
};
let CJK_COUNTRIES = ['CN', 'HK', 'TW', 'JP', 'KR', 'KP'];
let CJK_LANGUAGES = ['zh', 'ja', 'ko'];
let address = {
    /**
     * Gets the globalization for the specified country code.
     * A: Address Lines (2 or 3 lines address)
     * C: City (Locality)
     * S: State (Administrative Area)
     * K: Country
     * Z: ZIP Code / Postal Code
     * n: newline
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @return {{fmt: string, input: string, require: string}} Format Data
     */
    getAddressInfoForCountry: function getAddressInfoForCountry(langCode, countryCode) {
        let code = this.getCountryFromLocale(langCode, countryCode);
        if (data[code]) {
        // Double check.
            let cloneAddressRep = Object.freeze(Object.assign({}, data[code]));
            return Object.freeze({
                address: cloneAddressRep,
            });
        }
        return {};
    },
    /**
     * Get the format pattern.
     * A: Address Lines (2 or 3 lines address)
     * C: City (Locality)
     * S: State (Administrative Area)
     * K: Country
     * Z: ZIP Code / Postal Code
     * n: newline
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @return {string} Address Format Pattern
     */
    getAddressFormat: function getAddressFormat(langCode, countryCode) {
        let code = this.getCountryFromLocale(langCode, countryCode);
        if (data[code]) {
        // Double check.
            return data[code].fmt;
        }
        return '';
    },
    /**
     * Get the input order pattern.
     * A: Address Lines (2 or 3 lines address)
     * C: City (Locality)
     * S: State (Administrative Area)
     * K: Country
     * Z: ZIP Code / Postal Code
     * n: newline
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @return {string} Input Order
     */
    getAddressInputOrder: function getAddressInputOrder(langCode, countryCode) {
        // A special case to deal with en_HK locale. We want to use US like
        // format for en_HK.
        // See W-4718344
        if (langCode && langCode.toLowerCase() == 'en' && countryCode && countryCode.toUpperCase() == 'HK') {
            langCode = 'en';
            countryCode = 'US';
        }
        let code = this.getCountryFromLocale(langCode, countryCode);
        if (data[code]) {
        // Double check.
            return data[code].input;
        }
        return '';
    },
    /**
     * Get the input order pattern for all fields.
     * A: Address Lines (2 or 3 lines address)
     * C: City (Locality)
     * S: State (Administrative Area)
     * K: Country
     * Z: ZIP Code / Postal Code
     * n: newline
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @return {string} Input Order
     */
    getAddressInputOrderAllField: function getAddressInputOrderAllField(langCode, countryCode) {
        // A special case to deal with en_HK locale. We want to use US like
        // format for en_HK.
        // See W-4718344
        if (langCode && langCode.toLowerCase() == 'en' && countryCode && countryCode.toUpperCase() == 'HK') {
            langCode = 'en';
            countryCode = 'US';
        }

        // Double check.
        let code = this.getCountryFromLocale(langCode, countryCode);
        if (data[code]) {
            let input = data[code].input;

            // Add missing patterns.
            if (input.indexOf('S') === -1) {
                input = input.replace('K', 'SK');
            }
            if (input.indexOf('C') === -1) {
                input = input.replace('S', 'CS');
            }
            if (input.indexOf('Z') === -1) {
                input = input.replace('C', 'ZC');
            }
            return input;
        }
        return '';
    },
    /**
     * Get required fields.
     * A: Address Lines (2 or 3 lines address)
     * C: City (Locality)
     * S: State (Administrative Area)
     * K: Country
     * Z: ZIP Code / Postal Code
     * n: newline
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @return {string} Required Fields
     */
    getAddressRequireFields: function getAddressRequireFields(langCode, countryCode) {
        let code = this.getCountryFromLocale(langCode, countryCode);
        if (data[code]) {
        // Double check.
            return data[code].require;
        }
        return '';
    },
    /**
     * Format a address values for given language code and country code with specified line break.
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values Actual Address Data
     * @param {string} lineBreak Line Break
     * @return {string} Formatted Address
     */
    formatAddressAllFields: function formatAddressAllFields(langCode, countryCode, values, lineBreak) {
        let code = this.getCountryFromLocale(langCode, countryCode, values);
        if (data[code]) {
        // Double check.
            let pattern = data[code].fmt;
            // Some countries don't have City, State or ZIP code. We don't want to
            // lose those data from formatted string.
            if (values.zipCode && pattern.indexOf('%Z') === -1) {
                pattern = pattern.replace('%K', '%Z %K');
            }
            if (values.city && pattern.indexOf('%C') === -1) {
                pattern = pattern.replace('%K', '%C %K');
            }
            if (values.state && pattern.indexOf('%S') === -1) {
                pattern = pattern.replace('%K', '%S %K');
            }
            return this.buildAddressLines(pattern, values, lineBreak, true);
        }
        return '';
    },
    /**
     * Format a address values for given language code and country code with specified line break.
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values Actual Address Data
     * @param {string} lineBreak Line Break
     * @return {string} Formatted Address
     */
    formatAddress: function formatAddress(langCode, countryCode, values, lineBreak) {
        let code = this.getCountryFromLocale(langCode, countryCode, values);
        if (data[code]) {
        // Double check.
            return this.buildAddressLines(data[code].fmt, values, lineBreak, true);
        }
        return '';
    },
    /**
     * Creates an array of address lines given the format and the values to use.
     *
     * @param {string} pattern
     * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values
     * @param {string} lineBreak
     * @param {string} ignoreEmptyLines
     * @return {string} the text for use in the address
     */
    buildAddressLines: function buildAddressLines(pattern, values, lineBreak, ignoreEmptyLines) {
        return addressFormatter.format(values, pattern, lineBreak, ignoreEmptyLines);
    },
    /**
     * Resolve the reference by tracing down the _ref value.
     * @param {*} data Address Format Data
     * @param {string} countryCode Country Code
     * @return {*} Referenced Address Format Data
     */
    followReferences: function followReferences(data, countryCode) {
        if (data[countryCode] && data[countryCode]._ref) {
            return this.followReferences(data, data[countryCode]._ref);
        }
        return countryCode;
    },
    /**
     * Check strings for Han characters
     *
     * @param {...string} values String values to check against
     * @return {boolean} true if any of string values contain Han script character
     */
    containsHanScript: function containsHanScript() {
        for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
            values[_key] = arguments[_key];
        }
        if (!values || !Array.isArray(values)) return false;
        return values.some(function(value) {
            if (!value) return false;
            // Javascript regex do not work with surrogate pairs so String#match is unusable with supplemental ranges.
            // Iterating a string returns a char that contains one codepoint.
            // Surrogate pairs will be returned as a pair.
            // Unicode block ranges: @see http://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt
            let _iterator = _createForOfIteratorHelper(value);
            let _step;
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    let singleChar = _step.value;
                    let codePoint = singleChar.codePointAt(0); // Thank you ES2015
                    if (0x2e80 <= codePoint && codePoint <= 0x2eff ||
            // CJK Radicals Supplement
            0x3300 <= codePoint && codePoint <= 0x33ff ||
            // CJK Compatibility
            0xfe30 <= codePoint && codePoint <= 0xfe4f ||
            // CJK Compatibility Forms
            0xf900 <= codePoint && codePoint <= 0xfaff ||
            // CJK Compatibility Ideographs
            0x2f800 <= codePoint && codePoint <= 0x2fa1f ||
            // CJK Compatibility Ideographs Supplement
            0x3000 <= codePoint && codePoint <= 0x303f ||
            // CJK Symbols and Punctuation
            0x4e00 <= codePoint && codePoint <= 0x9fff ||
            // CJK Unified Ideographs
            0x3400 <= codePoint && codePoint <= 0x4dbf ||
            // CJK Unified Ideographs Extension A
            0x20000 <= codePoint && codePoint <= 0x2a6df ||
            // CJK Unified Ideographs Extension B
            0x2a700 <= codePoint && codePoint <= 0x2b73f ||
            // CJK Unified Ideographs Extension C
            0x2b740 <= codePoint && codePoint <= 0x2b81f ||
            // CJK Unified Ideographs Extension D
            0x2b820 <= codePoint && codePoint <= 0x2ceaf ||
            // CJK Unified Ideographs Extension E // Not on core
            0x2ceb0 <= codePoint && codePoint <= 0x2ebef ||
            // CJK Unified Ideographs Extension F // Not on core
            0x3200 <= codePoint && codePoint <= 0x32ff ||
            // Enclosed CJK Letters and Months
            0x31c0 <= codePoint && codePoint <= 0x31ef ||
            // CJK Strokes
            // Chinese
            0x3100 <= codePoint && codePoint <= 0x312f ||
            // Bopomofo
            0x31a0 <= codePoint && codePoint <= 0x31bf ||
            // Bopomofo Extended
            0x2f00 <= codePoint && codePoint <= 0x2fdf ||
            // Kangxi Radicals
            0x2ff0 <= codePoint && codePoint <= 0x2fff ||
            // Ideographic Description Characters
            // Japanese
            0xff00 <= codePoint && codePoint <= 0xffef ||
            // Halfwidth and Fullwidth Forms
            0x3040 <= codePoint && codePoint <= 0x309f ||
            // Hiragana
            0x30a0 <= codePoint && codePoint <= 0x30ff ||
            // Katakana
            0x31f0 <= codePoint && codePoint <= 0x31ff ||
            // Katakana Phonetic Extensions
            0x1b000 <= codePoint && codePoint <= 0x1b0ff ||
            // Kana Supplement
            0x1b100 <= codePoint && codePoint <= 0x1b12f ||
            // Kana Extended-A // Not on core
            // Korean
            0x1100 <= codePoint && codePoint <= 0x11ff ||
            // Hangul Jamo
            0xac00 <= codePoint && codePoint <= 0xd7af ||
            // Hangul Syllables
            0x3130 <= codePoint && codePoint <= 0x318f ||
            // Hangul Compatibility Jamo
            0xa960 <= codePoint && codePoint <= 0xa97f ||
            // Hangul Jamo Extended-A
            0xd7b0 <= codePoint && codePoint <= 0xd7ff // Hangul Jamo Extended-B
                    ) {
                        return true;
                    }
                }
            } catch (err) {
                _iterator.e(err);
            } finally {
                _iterator.f();
            }
            return false;
        });
    },
    /**
     * Returns the address code (country code) for given locale and data.
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @param {*} values Address Data
     * @return {string} Address Code
     */
    getCountryFromLocale: function getCountryFromLocale(langCode, countryCode, values) {
        if (values) {
            let isCJK = !countryCode && CJK_LANGUAGES.indexOf(langCode.toLowerCase()) >= 0 || countryCode && CJK_COUNTRIES.indexOf(countryCode.toUpperCase()) >= 0;
            let isJA = !countryCode && 'ja' == langCode.toLowerCase() || countryCode && 'JP' == countryCode.toUpperCase();

            // English format (ja_en_JP) is only used when all fields do not contain CJK characters
            if (!(isJA && this.containsHanScript(values.address, values.city, values.state, values.country)) && isCJK && !this.containsHanScript(values.address)) {
                return this.getCountryFromLocale(langCode, 'EN_' + countryCode);
            }
        }
        let country = countryCode;
        // hack for 'uz_Latn_UZ'. caller may pass 'Latn' as countryCode. override with 'UZ' here.
        if (langCode == 'uz' && country && country.toLowerCase() == 'latn') {
            country = 'UZ';
        }

        // Address format should be always associated to a COUNTRY.
        // If country part is empty, we need to map language to a
        // certain country. For example, "de" -> "DE".da
        if (!country && languageCodeToCountry.languageCode[langCode]) {
            country = languageCodeToCountry.languageCode[langCode];
        }

        // Trace the real data from country reference.
        country = this.followReferences(data, country);
        if (!country || !data[country]) {
            return 'US'; // Always fall back to US format.
        }
        return country;
    },
    /**
     * Get fall back country code.
     *
     * @param {string} langCode Language Code
     * @param {string} countryCode Country Code
     * @param {*} address Address Data
     * @return {string} Address Code
     *
     * @deprecated Use getCountryFromLocale instead
     */
    getFallback: function getFallback(langCode, countryCode, address) {
        return this.getCountryFromLocale(langCode, countryCode);
    },
};

export { address };
//# sourceMappingURL=AddressFormat.es.js.map
