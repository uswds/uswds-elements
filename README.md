> [!CAUTION]
> Work on USWDS Elements, the Web Component version of the Design System, is happening in this repository. This code may not all be suitable for production use. Please refer to the documentation for each component.

# USWDS Elements

The [United States Web Design System](https://designsystem.digital.gov) is a toolkit of principles, guidance, and code that includes a library of open source user interface components and a visual style guide for U.S. federal government websites.

This repository contains the code for the Web Component-based version of the design system, which is currently in pre-release status, with a goal release of May 2025. We maintain other repositories for the [current version of the design system](https://github.com/uswds/uswds), which we call USWDS Core, as well as [its documentation and website](https://github.com/uswds/uswds-site). For USWDS Core and its documentation on the web, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

Over the course of the next several months and beyond, we will incrementally build new [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)-based implementations of USWDS Core. As we ship new USWDS Web Components, our intent is that you'll be able to use them alongside existing USWDS code.

- [More on our decision to use Web Components](https://github.com/uswds/uswds-proposals/blob/main/decisions/0001-use-web-components.md)

## Upgrading to Web Components

We are releasing these Web Components (USWDS Elements) incrementally with the intent that they can also be added gradually to existing sites that are currently using USWDS. If you aren't currently using USWDS or you're using a version older than USWDS 3, we recommend adopting version 3 in the near term rather than waiting until all of USWDS Elements is production-ready.

## Installation using node and npm

1. Install `node/npm`. Below is a link to find the install method that coincides with your operating system:
    - Node (see [.nvmrc](https://github.com/uswds/uswds-elements/blob/develop/.nvmrc) for version number), [Installation guides](https://nodejs.org/en/download)

    **Note for Windows users:** If you are using Windows and are unfamiliar with Node or npm, we recommend following [Team Treehouse's tutorial](http://blog.teamtreehouse.com/install-node-js-npm-windows) for more information or [installing and running your project from Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm).

2. Make sure you have installed it correctly:

    ```shell
    npm -v
    10.9.4 # This line may vary depending on what version of Node you've installed.
    ```

3. Create a `package.json` file. You can do this manually, but an easier method is to use the `npm init` command. This command will prompt you with a few questions to create your `package.json` file.

4. Add `@uswds/uswds` to your project’s `package.json`:

    ```shell
    npm install -S @uswds/elements
    ```

The `@uswds/elements` module is now installed as a dependency.

**Note:** We do _not_ recommend directly editing the design system files in `node_modules`. One of the benefits of using a package manager is its ease of upgrade and installation. If you make customizations to the files in the package, any upgrade or re-installation will wipe them out.

## Using USWDS Elements in your project

How you add the component to a page may vary depending on the tools you use in your work. If you use Vite, you can add components by importing them into a script that is imported elsewhere into a page:

```js
// Importing into a javascript file, like index.js
import { UsaBanner } from "@uswds/elements";
```

```html
<!-- importing directly into an HTML page -->
<script type="module">
    import { UsaBanner } from "@uswds/elements";
</script>
<usa-banner></usa-banner>
```

## Style theming and tokens

Each USWDS Element provides support for theming by exposing CSS custom properties (CSS variables) that can be used to control the appearance of the component.

There are interactive form controls in our Storybook instance that demonstrate how to use the theming variables, provide custom text, and otherwise customize the components.

For example, the `usa-banner` component can be customized by setting the `--usa-banner-background-color` CSS variable to a color of your choosing:

```html
<style>
    usa-banner {
        --usa-banner-background-color: #d9e8f6; /** equivalent to `primary-lighter` from USWDS - https://designsystem.digital.gov/design-tokens/color/theme-tokens/#theme-color-tokens-table-2 */
        --usa-banner-button-close-background-color: #d6f3ff;
    }
</style>
<usa-banner></usa-banner>
```

This can be seen in the demo on the [USWDS Elements Storybook](<https://federalist-ab6c0bdb-eccd-4b26-bb5f-b0154661e999.sites.pages.cloud.gov/site/uswds/web-components/?path=/story/components-banner--default&args=--usa-banner-background-color:!hex(e4f7ff)>).

**Note:** Please be mindful of the accessibility implications of customizing component appearance. It is your responsibility to ensure that your customizations meet the [accessibility requirements](https://designsystem.digital.gov/accessibility/) of the design system and pass any [WCAG 2.2](https://www.w3.org/TR/WCAG22/) or [Section 508](https://www.section508.gov/) accessibility tests.

> [!IMPORTANT]
> If you are bundling your application using Vite, you may encounter a JavaScript error when using the `usa-banner` component with Vite's dev server (this also applies to other Vite-based tools such as Astro). To work around this, you may need to run the dev server in production mode by prefixing the command to start the server with `NODE_ENV=production`. For instance, if you run the command `npm run dev` to start your dev server, you should start it with `NODE_ENV=production npm run dev`.

## Documentation

For more detailed documentation, refer to the Storybook for USWDS Elements. You can visit the most up-to-date Storybook documentation on [Cloud.gov Pages](https://federalist-ab6c0bdb-eccd-4b26-bb5f-b0154661e999.sites.pages.cloud.gov/site/uswds/web-components/?path=/docs/readme--docs).

## Browser support

We’ve designed the design system to support older and newer browsers through [progressive enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement). The current major version of USWDS Elements (v1) follows the [2% rule](https://gds.blog.gov.uk/2012/01/25/support-for-browsers/): we officially support any browser above 2% usage as observed by [analytics.usa.gov](https://analytics.usa.gov/). Currently, this means support for the newest versions of Chrome, Firefox, and Safari.

## Accessibility

The design system also meets the [WCAG 2.0 AA accessibility guidelines](https://www.w3.org/TR/WCAG20/) and conforms to the standards of [Section 508 of the Rehabilitation Act](http://www.section508.gov/). Additionally, we try to meet the requirements of [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

We use the following tools to ensure USWDS is accessible:

- [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html).
- [Axe core](https://www.deque.com/axe/).
- [Axe dev tools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US).

If you find any issues with our accessibility conformance, please create an issue in our GitHub repo or send us an email at [uswds@gsa.gov](mailto:uswds@gsa.gov). We prioritize accessibility issues. See [the Accessibility page of our website](https://designsystem.digital.gov/documentation/accessibility/) for more information.

## Component Versions

| Component    | Status    |
| ------------ | --------- |
| `usa-banner` | Beta      |
| `usa-link`   | Pre-alpha |
