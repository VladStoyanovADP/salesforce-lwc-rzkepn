# Migrating from Other Modal Solutions to LightningModal

This document is about migrating existing modal implementations.

## **Creating a new LWC-based modal implementation?**
* Starting in release 236, when utilizing LWC or Aura code, your team should use `LightningModal`
* Dive into the details here by [Creating a Modal Component](modal.md#creating-a-modal-component)
* Or, take a look at some of our [Modal Code Examples](modal.md#modal-code-examples).

## Why `LightningModal`?

`LightningModal` provides a full-featured, modern, accessible modal solution intended for on and off the Salesforce platform (see [intended timeline](#intended-timeline-for-modal-solutions)) _that will **replace all** previous Lightning modal solutions_. Whether you are starting a completely new modal implementation, or have an existing modal implementation using a prior Aura or LWC modal solution, `LightningModal` is your Salesforce modal migration path *forward*.

**Why migrate to `LightningModal`?** The `LightningModal` component has fewer limitations, is actively supported for use both on the Salesforce platform (starting in 236) and off Salesforce platform (likely, starting in 238), has SLDS blueprints and accessibility best practices built in, is performant, provides a scroll bar when your modal content is taller than the screen height, and is well-tested. Using `LightningModal` gives your team more time to implement your app's unique features instead of recreating modal functionality.

### Intended Timeline for Modal Solutions:
1. `LightningModal`:
    * Availability:
        * for new Salesforce internal projects in release 236 via `lwc-components-lightning` package
        * for new Salesforce internal _and_ planned for external projects in release 238 via `lightning-base-components` (npmjs.com) package
    * Ongoing Support:
        * starting in release 236 for Salesforce internal teams
1. `lightning-dialog`:
    * Availability:
        * from 230, for all new modal projects, _within documented limited use cases_ (**not recommended in one.app**)
        * **recommend** transitioning new Salesforce internal modal work to `LightningModal` starting in release 236
    * Ongoing Support:
        * for LWC modal projects, through end of 236, _within documented limited use cases_
        * planned review for deprecation starting in 238
1. `ui:createPanel`:
    * Availability:
        * for Aura modal projects through end of 236
        * **recommend** transitioning new Salesforce internal modal work to `LightningModal` starting in release 236
    * Ongoing Support:
        * through the end of release 236
        * planned review for deprecation starting in 238

## Migrating Existing Modal Implementations

In this section, we’ll discuss migrating your existing modal implementation to `LightningModal` by showing the implementation differences in markup and APIs.

* **Migrating from custom modal implementations** using [SLDS modal blueprints](https://www.lightningdesignsystem.com/components/modals/)
* **Migrating from Aura** **`ui:createPanel`**
* **Migrating from** [**`lightning-dialog`**](https://git.soma.salesforce.com/aura/lightning-global/tree/master/ui-lightning-components/src/main/modules/lightning/dialog) (Salesforce internal only)

## Key Points For Modal Code Migration

* **There isn't a `<lightning-modal>` tag!**  Instead, you extend `LightningModal`, and call `.open()` and `.close()` on your modal implementation.  You'll never use the `<lightning-modal>` tag within your code.
* **In most implementations, you’ll have, at minimum, two components**:
    1. your `CustomModal` modal component which defines behavior and is wrapped in the modal window
    1. your application component that imports your `CustomModal` component and calls `.open({})` to open your modal
* **You don’t need to set the base SLDS modal CSS classes, or manage the accessibility of the modal itself.** Each of the modal helper components have the SLDS styling classes and accessibility built in. However, you're responsible for making sure your modal’s content has accessibility covered!
* **Currently, auto-focus on the first interactive element is performed automatically** once at the beginning of modal creation.
* **You only work directly with helper components named `lightning-modal-*`**. `LightningModal` is actually a collection of supporting components that create the underlying LWC-based modal features and functionality. When you extend `LightningModal`, you can use the modal content helper components like `lightning-modal-header` (optional), `lightning-modal-body`, and `lightning-modal-footer` (optional) to set up the content of the modal, and call `.open()` in the `onclick` event handler of your app page's button or link.
* **We’ve provided a few `LightningModal` code examples for use in our LWR-based `playground.html` file, or our deprecated `demo/app` code playground to get you started.** Each of these examples is based on an SLDS blueprint pattern, and can be found in the '`modal/__examples__`' folder. Review the [Modal Code Examples](modal.md#modal-code-examples) section.

## Migrating From a Custom Built Modal

If you have an existing LWC custom modal that implements the HTML and CSS from the [SLDS modal blueprint](https://www.lightningdesignsystem.com/components/modals/) and custom JavaScript behavior, you likely have your own custom api attributes and methods. We recommend the following:

* Start by looking at our [Modal Code Examples](modal.md#modal-code-examples) for comparison to your own implementation
    * Each of these code examples can be viewed within the `modal/__examples__` folder
    * Each can be previewed within our repo by editing the `playground.html` file (by running `yarn start`) or the deprecated `demo/app` and (running `yarn app:start`) utilizing the corresponding tag:
        * `<modal-all>`
        * `<modal-headless>`
        * `<modal-footless>`
    * Wrap the desired example tag within a `<template></template>` tag
    * For modal blueprints and variants, review the [Modal and supported variants](modal.md#modal-and-supported-variants) section.
* `LightningModal` provides three helper components for header, body content, and footer sections. The `lightning-modal-body` is the only required component.
* You don’t need to worry about setting any of the base SLDS modal CSS classes. These are set for you. If you’d like to further style your modal, review the modal [Style Hooks](modal.md#style-hooks) section
* Review our `LightningModal` documentation:
    * [Creating a Modal Component](modal.md#creating-a-modal-component)
    * [Opening a Modal Instance](modal.md#opening-a-modal-instance)
    * [About Modal Instances](modal.md#about-modal-instances)
    * [Using the open() method](modal.md#using-the-open-method)
    * [Using the close() method](modal.md#using-the-close-method)
    * [Modal Code Examples](modal.md#modal-code-examples)

## Migrating From Aura Modals

If you are ready to move an existing modal implementation from Aura-based `ui:createPanel`, `ui:createModal`, or `ui:modal`, here are some key differences:

### Implementation differences

This section covers implementation differences between Aura modal solutions and `LightningModal`.

* When setting up the config before opening the modal, either pass your content via custom written `@api` (see [Using the open() method](modal.md#using-the-open-method)), or set it statically within your template (see the [Base Modal](modal.md#base-modal) HTML template example)
* If you don't want a header and title section, simply remove `lightning-modal-header`. You must then pass the required `label` value (for the accessible modal title) when opening the modal, for example `Modal.open({label: ‘Descriptive Modal Header’})`. See our [Headless Variant](modal.md#headless-variant) documentation, and [Modal Code Examples](modal.md#modal-code-examples). Same goes for the footer section, if you don’t want a footer, don't use `lightning-modal-footer`. Only `lightning-modal-body` is required.
* **For specific events and event listeners availability** within `createPanel` or `createModal`, for example, `onBeforeShow`, `onAfterShow`, `onCreate` or `onDestroy`, see our section on [About Modal Events](modal.md#about-modal-events).
    * **Recommend:** create these as [custom events](https://developer.salesforce.com/docs/platform/lwc/guide/events-create-dispatch)
* **If you want to get element reference,** for example, `linkElement.querySelector(‘[data-my-link]’)` within the content you’ve set within your modal, utilize data attributes.  For this example, `<a href=“#” data-my-link>`, rather than relying on ID references, since these dynamically change in LWC).
    * **Recommend:** See the note within the [ARIA Attributes](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-accessibility-attributes#aria-attributes) section.
* If you need to style aspects of your modal, you can apply CSS styles directly to your markup within the helper components.
    * **Recommend:** See the example under [Directional Variant](modal.md#directional-variant) section.
* If you need to support a modal with a [directional variant](https://www.lightningdesignsystem.com/components/modals/#Directional), please review our [Directional Variant](modal.md#directional-variant) documentation.

### API differences

This section covers `@api` or attribute differences between Aura modal solutions and `LightningModal`.

#### Supported APIs
See [ui:modal](https://git.soma.salesforce.com/aura/aura/tree/master/aura-components/src/main/components/ui/modal)

* `title` attribute has been changed to the `label` attribute
    * You set the `label` attribute on the `lightning-modal-header` helper component or in the case of a headless modal, when you open the modal, you would set the `label` attribute when opening the modal.  For example: `Modal.open({ label: ‘Modal Descriptive Title’ })`
* `**LightningModal**` currently has only four official attributes A
    * `size` - to set the width of the modal
    * `label` - to set the modal heading
    * `description` - to set the modal's `aria-description` or `aria-describedby` property
    * `disableClose` - a boolean value to toggle usability of the Close button
    * **Modal enables you to pass in your own `@api`** to interact and wire-up your own desired functionality within the modal (interactive elements like buttons, inputs, etc) by setting key value pairs on `.open({ options: [], buttons: [] })`, for example
    * **Modal enables setting event listeners** that may be listened to by the base LWC component (that opens the modal) by passing custom events into your LightningModal implementation by setting keys startin with `on` `.open({ onselect: () => { /* do stuff */ } })`, setting the corresponding listener on the outer templates markup, and firing the custom event `select` from within the modal.  See [modal.md](modal.md#about-modal-events) for examples

#### Unsupported API
See [ui:modal](https://git.soma.salesforce.com/aura/aura/tree/master/aura-components/src/main/components/ui/modal)

* **Animation related:** `animation`, `closeAnimation`, `useTransition`
    * **recommend:** remove for now, future support may be available
* **Close button related:** `closeAction`**,** `showCloseButton`, `closeButton`, `closeDialogLabel`
    * **notes:** no recommendations, these properties cannot be altered currently
* **Setting CSS Classes related:** `class,` `modalClass`, `headerClass`, `bodyClass`, `footerClass`
    * **recommend:** apply your required styles within the modal component. See the [Directional Variant](modal.md#directional-variant) section for an example.
* **Accessibility related:** trapFocus, ariaLabelleBy, ariaDescribedBy
    * **notes:** the first two properties are managed for you, ariaDescribedBy feature will be added later
* **autoFocus** - **note:** this is currently happens automatically at open time
* **icon** - **note:** no current ability set an icon
* **titleDisplay** - note: not supported
    * **Recommend:** If you don’t want a header section or title in the modal, set a descriptive label attribute value for accessibility, and don’t add the `lightning-modal-header` component.

## Migrating From `lightning-dialog`

If you need to move an existing `lightning-dialog` implementation, you’ll need to consider these changes:

### Implementation Differences

This section covers implementation differences between `lightning-dialog` and `LightningModal`.

* `lightning-dialog` and `LightningModal` are fairly similar in terms of their template code implementation, with the exception that the different sections within the `LightningModal` have separate helper components.
* `lightning-dialog` is inline with your application limiting the z-index to the context where it is placed. `LightningModal` is created outside and above all elements with a managed z-index to not conflict with other overlays.
* You implement `lightning-dialog` via its tag in your markup. There is no equivalent `lightning-modal`, instead you extend `LightningModal`. For example:
    * import **LightningModal** from 'lightning/modal';
    * export default class **MyModal _extends_ LightningModal** { /* your code */ }
* `LightningModal` makes use of extending `LightningOverlay` which provides `.open()` and `.close()` methods, whereas `lightning-dialog` worked from LWC declarative implementation without extends.  See our sample [Modal Code Examples](modal.md#modal-code-examples) documentation.
* Custom events - `LightningModal` only provides a `privateclose` event.  `<lightning-dialog>` provided events `cancel` or `close` events.

### API and Method Differences

This section covers api or attribute and method differences between `lightning-dialog` and `LightningModal`.

* The API to indicate the modal's title or heading is renamed from `header` to `label`
    * From: `<lightning-dialog header=“Descriptive Modal Heading”>`
    * To:
        1. `<lightning-modal-header label=“Descriptive Modal Heading”>` for modal with header section
        1. Or, `MyModal.open({ label: ‘Descriptive Modal Heading’ })` for headless modal
* The method to show the modal is renamed
    * From: `.showModal()`
    * To: `.open()`
    * `.open()` is inherited when you extend LightningModal.
