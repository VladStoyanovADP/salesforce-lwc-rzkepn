# internationalizationLibrary

Currently, the code base contains logic that directs execution in two different paths, depending whether a component is being executed on the platform vs off. That logic, was intented to aid the migration off the current Aura's localization service, in favor of an unified and universal solution based on standards, that could be consumed on any enviroment.

Such logic can be detailed, on a high level as follows, at run time a path execution decides that:

if a component is run on the platform, it will make use of Aura's localization Service to format and parse dates/times.
if a component is run anywhere else, it will use the globalization i18n-service

## When to use this utility

Because of our legacy support and backward compatiblity contracts, we use this utility as a facade, with the hope that once we are able to fully deprecate Aura's Localization service, this utility will help us to transition into [localizerjs](https://git.soma.salesforce.com/Globalization/localizerjs).

If you have an existing component that maps to any of the Aura's localization service methods, this module will aid with that.

## Our recommmended approach

- For declarative usage, use our localization specific components, they will work both off/on platform.
- For low level, programatic usage, dealing with dates/times/numbers etc. use [localizerjs](https://git.soma.salesforce.com/Globalization/localizerjs). The next section covers more on usage and how these utiltiies are exposed.

## Access/Exposure/Usage

1. [internationalizationLibrary](https://github.com/salesforce-experience-platform-emu/lightning-components/tree/master/ui-lightning-components/src/main/modules/lightning/internationalizationLibrary) as a module is not exposed on the platform, but it's part of our NPM package.
2. [localizerjs](https://git.soma.salesforce.com/Globalization/localizerjs) is maintained by the Globalization team, however, we expose it as part of Lightning. For example [i18nService](https://github.com/salesforce-experience-platform-emu/lightning-components/tree/master/ui-lightning-components/src/main/modules/lightning/i18nService). All usage of `localizerjs` should be consumed as `lightning/i18nService` and `lightning/i18nCldrOptions`. This is exposed on the platform internally and available as part of our NPM package.
