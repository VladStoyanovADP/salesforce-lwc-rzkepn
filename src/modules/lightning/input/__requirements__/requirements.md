### Events

-   When entering a value and that value is "committed", a 'commit' event is dispatch, the event is not bubbling,
    nor cancelable and has no detail.
    Committing a number is defined as:
    the user presses Enter
    OR blurs away from the input
    OR presses the "x" clear button for type search)

### `number``

-   When not a valid ISO number is passed as a value to the input
    either via an attribute `<lightning-input type="number" value="notANumber"` or
    property `component.value = 'notANumber'`, the value should be set to empty string.
    This also means on type changes the number needs to be re-parsed.

    > Covered by Jest tests.

-   When not a valid ISO number is passed to 'step', the value of the step should be the default one.
    Currently that default is 'undefined'. It would be better if this value would be '1' instead.

    > Covered by Jest tests.

-   When entering a number, as the number is typed, it's converted to an ISO number and set as the value.
    The conversion is done by using the user's current locale (not browser and not OS but rather the locale provided
    by the localization service).

    > Covered by integration tests

-   In mobile environments a "numbers" keyboard should be presented when an input of type number is tapped.
    This is done by setting `inputmode="decimal"`

    > Covered by snapshot test

-   When input has the focus and Up/Down key arrows are pressed, the number is increased/decreased as by the given step, if step is not given, the increases are by 1 and the number is rounded off to an integer.
    When no initial number is given a value of 0 is used (as such a clck on '-' would net -1, and and '+" would result in 1).

    > Covered by integration tests

-   When numbers are increased either via Up/Down keys or by pressing the - and + buttons, both 'commit' and 'change'
    events are dispatched.

-   Bad input (like 1eee3) is flagged as invalid, when an input is flagged as invalid the input should not be formatted
    when blurred, the original input is kept.

    > Covered by integration tests

-   Entering West-Arabic/Hindu numbers should be supported. Due to the way aura localisation implements this these numbers
    can be mixed with regular numbers and can be entered even if the user locale is not of those types.

-   Very long number input should be supported (the number is no longer rounded off). This is subject to precision
    limitation of the Up/Down increase/decrease and various operations (like max/min/step checks which are still bound by the usual js limits)

    > Covered by integration Tests

-   The 'change' event is fired when the component transitions to a badInput state (ie. validity.badInput is true).
    Specifically if a valid value is entered followed by a character that's invalid, it will trigger a 'change' event, and
    the value will be ''.

    > Covered by integration tests

-   When a number starts with a decimal separator (like -.2 or .3), the resulting value should always have a zero
    in front (ie. .value should be -0.2 and 0.3 respectively)

    > Covered by Jest tests

-   'step' attribute is used to determine the significant digits for formatting of a number; when 'step' has a superfluous .0 at the end, the number of significant digits should be 0; exponent format should also be correctly calculated, eg. 1.5e-5 should net 6 significant digits when formatting the number; positive exponents should also be correctly parsed (eg. 1e10 should net 0)

    > Covered by Jest tests

-   only valid characters are allowed to be typed (anything can be pasted in however), valid characters are considered:
    -   `0-9`
    -   `k` `K` `m` `M` `b` `B` `t` `T` (shortcuts)
    -   `e` `E` (exponent)
    -   `+` `-` `.` `,`
    -   West-Arabic/Hindu numbers
        > Covered by Jest and integration tests

#### number 'k' / 'm' / 'b' shortcuts

-   When an entered valid number in the given locale ends in "k", "K", "m", "M", "b", "B", "t" or "T" (shortcut suffix):
    -   as soon as the suffix is entered `value` is `1000 * the entered` number if "k" or "K" is the suffix, or `1000000 * the entered number` if "m" or "M" is the suffix, or `1000000000 * the entered number` if "b" or "B" is the suffix, or `1000000000000 * the entered number` if "t" or "T" is the suffix
        > Covered by Jest and Integration tests
    -   when blurring from the input, the value shown on the input should reflect the multiplied number (eg. for `1k` it could be `1,000` for a locale with `,` as a grouping separator)
        > Covered by Jest and Integration tests
    -   when the input is focused, the value that's in the input will be the multiplied number
        in the given locale with the correct decimal separator and no grouping separators (eg. if in a locale with "," as a decimal separator number `0,0001k` was entered, when focusing after a blur the number should show as `0,1`)
        > Covered by Jest and Integration tests (partially, it would be good to have a test that overrides the locale used to test with locales that have different decimal digits)
-   If the input is not a valid number but has a shortcut suffix at the end, when blurring from the input, and then focusing back on it, the original entered string should be preserved (eg. if `100eee10k` is entered, blurring out and focusing should preserve that value)
    > Covered by Jest tests
-   When setting the value programmatically, value that contains a shortcut suffix should not be considered valid
    > Covered by Jest tests

### Open questions

-   We need to define the behaviour for - and + when max or min are hit, and also whether it should round to the
    closest step. In addition the behaviour for when the number is larger than what js arithmetics can handle (because
    of the rounding errors the increase/decrease does nothing).
