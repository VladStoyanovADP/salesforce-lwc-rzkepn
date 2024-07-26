// TODO: remove file when migrating off aura
const FORMAT_MAP = {
    weekday: {
        short: 'EEE, ',
        narrow: 'EEE, ',
        long: 'EEEE, ',
    },
    month: {
        short: 'MMM ',
        narrow: 'MMM ',
        numeric: 'MMM ',
        '2-digit': 'MMM ',
        long: 'MMMM ',
    },
    day: {
        numeric: 'd, ',
        '2-digit': 'dd, ',
    },
    year: {
        numeric: 'yyyy ',
        '2-digit': 'yy ',
    },
    hour: {
        numeric12: 'h',
        numeric24: 'H',
        '2-digit12': 'hh',
        '2-digit24': 'HH',
    },
    minute: {
        numeric: 'mm',
        '2-digit': 'mm',
    },
    second: {
        numeric: 'ss',
        '2-digit': 'ss',
    },
    timeZoneName: {
        short: '[GMT]Z',
        long: '[GMT]Z',
    },
};

const SEPARATORS = [',', ' ', ':'];

function getWeekDayPart(format, options) {
    const weekdayOptionValue = options.weekday;
    if (FORMAT_MAP.weekday[weekdayOptionValue] !== undefined) {
        format.push(FORMAT_MAP.weekday[weekdayOptionValue]);
    }
}

function getMonthPart(format, options) {
    const monthOptionValue = options.month;
    if (FORMAT_MAP.month[monthOptionValue] !== undefined) {
        format.push(FORMAT_MAP.month[monthOptionValue]);
    }
}

function getDayPart(format, options) {
    const dayOptionValue = options.day;
    if (FORMAT_MAP.day[dayOptionValue] !== undefined) {
        format.push(FORMAT_MAP.day[dayOptionValue]);
    }
}

function getYearPart(format, options) {
    const yearOptionValue = options.year;
    if (FORMAT_MAP.year[yearOptionValue] !== undefined) {
        format.push(FORMAT_MAP.year[yearOptionValue]);
    }
}

function getTZPart(format, options) {
    const timeZoneNameOptionValue = options.timeZoneName;
    if (FORMAT_MAP.timeZoneName[timeZoneNameOptionValue] !== undefined) {
        if (options.timeZone === 'UTC') {
            format.push('[GMT]');
        } else {
            format.push(FORMAT_MAP.timeZoneName[timeZoneNameOptionValue]);
        }
    }
}

function getTimePart(format, options) {
    const hourOptionValue = options.hour,
        minuteOptionValue = options.minute,
        secondOptionValue = options.second;
    let hasTime = false;
    let hasHourOnly = false;

    // hour 12 hr or 24 hr
    if (hourOptionValue === 'numeric' || hourOptionValue === '2-digit') {
        hasTime = true;
        if (options.hour12 === false) {
            if (hourOptionValue === 'numeric') {
                format.push(FORMAT_MAP.hour.numeric24);
            } else {
                format.push(FORMAT_MAP.hour['2-digit24']);
            }
        } else if (hourOptionValue === 'numeric') {
            format.push(FORMAT_MAP.hour.numeric12);
        } else {
            format.push(FORMAT_MAP.hour['2-digit12']);
        }

        if (FORMAT_MAP.minute[minuteOptionValue] !== undefined) {
            format.push(':');
        } else if (FORMAT_MAP.second[secondOptionValue] !== undefined) {
            hasHourOnly = true;
        }
    }

    // minute
    if (FORMAT_MAP.minute[minuteOptionValue] !== undefined) {
        hasTime = true;
        format.push(FORMAT_MAP.minute[minuteOptionValue]);
        if (FORMAT_MAP.second[secondOptionValue] !== undefined) {
            format.push(':');
        }
    }

    // second
    if (FORMAT_MAP.second[secondOptionValue] !== undefined && !hasHourOnly) {
        hasTime = true;
        format.push(FORMAT_MAP.second[secondOptionValue]);
    }

    // AM/PM marker
    if (hasTime) {
        format.push(' a ');
    }

    if (hasHourOnly) {
        format.push('[(sec]: ' + FORMAT_MAP.second[secondOptionValue] + '[)]');
    }
}

/**
 * Function translating provided date time options to a
 * string that can be passed into Aura localization service.
 *
 * @param {Object} options - date time formatting options
 * @returns {string} representing provided options as a string -
 * e.g. "dd, MMM yyyy h:mm"
 */
export const getSkeleton = (options) => {
    const format = [];
    getWeekDayPart(format, options);
    getMonthPart(format, options);
    getDayPart(format, options);
    getYearPart(format, options);
    getTimePart(format, options);
    getTZPart(format, options);
    let formatStr = format.join('');
    SEPARATORS.forEach((element) => {
        if (formatStr.lastIndexOf(element) === formatStr.length - 1) {
            formatStr = formatStr.slice(0, -1);
        }
    });
    return formatStr;
};
