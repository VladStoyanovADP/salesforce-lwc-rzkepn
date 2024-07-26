# Accessibility for Custom Types Utilizing Popups

## Background

Lightning-datatable hijacks traditional tabindex based focusing to utilize a [two level mode of navigation](https://www.lightningdesignsystem.com/components/data-tables/#Accessibility-2). Standard Cell types already follow necessary patterns such that they properly function in both modes.

With custom types, you might need to do extra work if your custom type uses focus trappable elements (elements that keep focus in the cell until a point). 

For any components that use some form of popup, you must ensure the components function properly in Navigation and Action mode.

## Process/Rationale

To accomplish full keyboard accessibility with popups:
- Ensure the popup is only open while focused
- Ensure that on the popup we stop propogation on key down
    - This is to prevent the focus from moving to other cells when pressing tab/arrow keys
- Ensure elements inside the popup are focusable with keyboard navigation (up to consuming team)
