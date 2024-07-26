import { isCSR } from './ssr';

/**
 * Verify if user is using MAC OS or not
 * @returns {boolean} - true if Mac OS
 */
export const isMacOSTest = ({ userAgent }) => {
    return /(macintosh|macintel|macppc|mac68k|macos)/i.test(userAgent);
};

/**
 * Verify if user is using iOS or not
 * @returns {boolean} - true, if iOS
 */
export const isiOSTest = ({ userAgent }) => {
    return /(iphone|ipad|ipod)/i.test(userAgent);
};

/**
 * Verify if user is using Windows OS or not
 * @returns {boolean} - true, if Windows OS
 */
export const isWindowsOSTest = ({ userAgent }) => {
    return /(win32|win64|windows)/i.test(userAgent);
};

/**
 * Verify if user is using Android OS or not
 * @returns {boolean} - true, if Android OS
 */
export const isAndroidOSTest = ({ userAgent }) => {
    return /android/i.test(userAgent);
};

export const isMacOS = isCSR && isMacOSTest(navigator);
export const isWindowsOS = isCSR && isWindowsOSTest(navigator);
export const isiOS = isCSR && isiOSTest(navigator);
export const isAndroidOS = isCSR && isAndroidOSTest(navigator);
