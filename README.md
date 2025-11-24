> [!CAUTION]
> Work on development of the HTML Web Component version of the U.S. Web Design System, called USWDS Elements, is happening in this repository. This code may not all be suitable for production use. Work on USWDS Elements is currently taking a slower-than-previous iterative approach to development. Each USWDS Elements component in this repository may be in a different state of development, with USWDS Banner always intended to be closest to stable. Please refer to the documentation for the status of each component.

# USWDS Elements

The [United States Web Design System](https://designsystem.digital.gov) is a toolkit of principles, guidance, and code that includes a library of open source user interface components and a visual style guide for U.S. federal government websites.

This repository contains the code for the Web Component-based version of the design system, which is currently in pre-release status. We maintain other repositories for the [current version of the design system](https://github.com/uswds/uswds), which we call USWDS Core, as well as [its documentation and website](https://github.com/uswds/uswds-site). For USWDS Core and its documentation, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

We're working on incrementally building new [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)-based implementations of USWDS Core components. As we ship new USWDS Elements Web Components, our intent is that you'll be able to use them alongside existing USWDS code.

- [More on our decision to use Web Components](https://github.com/uswds/uswds-proposals/blob/main/decisions/0001-use-web-components.md)

## Upgrading to Web Components

We're releasing these Web Components (USWDS Elements) incrementally with the intent that they can also be added gradually to existing sites that are currently using USWDS Core. If you aren't currently using USWDS or you're using a version older than the current USWDS 3, we recommend adopting version 3 in the near term rather than waiting until all of USWDS Elements is production-ready.

## Installation using node and npm

1. Install `node/npm`. In the link below you can find the install method that coincides with your operating system:
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

How you add a USWDS Elements component to a page might vary depending on your tools. If you use Vite, you can add components by importing them into a script that's imported elsewhere into a page:

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

Interactive form controls in our Storybook instance can demonstrate how to use the theming variables, provide custom text, and otherwise customize the components.

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

You can see this in the demo on the [USWDS Elements Storybook](<https://federalist-ab6c0bdb-eccd-4b26-bb5f-b0154661e999.sites.pages.cloud.gov/site/uswds/web-components/?path=/story/components-banner--default&args=--usa-banner-background-color:!hex(e4f7ff)>).

**Note:** Please be mindful of the accessibility implications of customizing component appearance. It's **your** responsibility to ensure that your customizations meet the [accessibility requirements](https://designsystem.digital.gov/accessibility/) of the design system and pass any [WCAG 2.2](https://www.w3.org/TR/WCAG22/) or [Section 508](https://www.section508.gov/) accessibility tests.

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

## Publishing

This repository is automatically published to NPM when a new release is created.

We use Changesets to manage changelogs, version bumps, pre-releases (alpha/beta), and automated publishing via GitHub Actions. The repository includes a pre-configured Changesets setup so you can create pre-releases (for example, `alpha`) and standard releases.

### Pre-release flow

If you're working on a pre-release version, enter pre-release mode:

```bash
   npx @changesets/cli pre enter <tag> # for example, npx @changesets/cli pre enter alpha
```

This will write a `.changeset/pre.json` that configures the pre-release tag and initial version. This file should be committed to the repository.

**Note:** Once you're in pre-release mode, you don't have to enter it every time. When you're ready to exit pre-release mode, run:

```bash
npx @changesets/cli pre exit
```

### Version bumps, and publishing (Changesets)

1. Create a changeset describing your change(s)
    - Run the interactive prompt and follow the questions:

        ```bash
        npx @changesets/cli
        ```

    - The command creates a file under the `.changeset/` directory that describes the packages and the release type (patch/minor/major). You can edit this file to add more details, such as a link to the issue or pull request that the change addresses. The file will automatically get a nonsensical name like `fire-penguin-annex.md`, and that's normal. These files are only in the repository for a short time, to generate changelogs and version bumps. They aren't published to NPM and are cleaned up after the release is published.

2. Bump versions locally (optional)
    - To update package.json versions and changelogs locally before publishing:

        ```bash
        npx @changesets/cli version
        ```

    - Commit the resulting changes (package.json updates and generated changelog files):

        ```bash
        git add .
        git commit -m "chore(release): version packages and changelogs"
        ```

3. Publish
    - Option A — Let the repository automation handle publishing (recommended):
        - Push your branch to GitHub and open a PR. The CI / release automation will run and, depending on the configuration and merged changesets, will publish releases when merged to `main`.
    - Option B — Publish locally (requires NPM credentials and appropriate tokens):

        ```bash
        npm run release
        ```

        This script typically runs your tokenized publish flow (it may run builds and then `changeset publish`).

#### How the automation works (GitHub Actions)

- There's a CI workflow configured to automate release and publish:
    - The workflow runs on pushes to `main` and uses the Changesets GitHub Action.
    - The action can either create a release PR or publish directly to NPM depending on repository and action settings.
    - The workflow uses repository secrets:
        - `GITHUB_TOKEN` — standard workflow permission for the action to create PRs/commits.
    - The action is configured to run the project’s release script (for example `npm run release`) and is run in a controlled environment; it will also disable Husky hooks during automated runs (HUSKY=0) to avoid local commit hooks blocking automation.

#### Notes, tips, and troubleshooting

- Ensure your changeset accurately reflects the semantic change (patch/minor/major). Changesets drives the version bump and changelog generation.
- Pre-release flows:
    - The repository includes a `.changeset/pre.json` configuration that sets a default pre-release tag (e.g., `alpha`) and initial versions for pre-release packages. Use `npx @changesets/cli pre enter  <tag>` to begin a pre-release cycle.
    - When in pre mode, version bumps will produce pre-release identifiers (for example, `1.0.0-alpha.1`).
- CI vs local publish:
    - For most contributors, pushing a properly authored changeset and opening a PR is the recommended route—automation will create the release or open the release PR for maintainers to review.
    - If you must publish locally, make sure `NPM_TOKEN` is configured in your environment or use a CI/protected account to run the publish steps.
- If releases aren't being published as expected:
    - Verify `NPM_TOKEN` exists in repository secrets and has publish scope.
    - Ensure the commit/push to `main` contains a changeset (or the automation has been triggered by the Changesets action).
    - Review the release workflow logs in GitHub Actions for details (it'll show the changesets step and any publishing errors).
- If you want to change the default pre-release tag (for example, from `alpha` to `beta`), update the `.changeset/pre.json` file and follow the pre-mode steps above.

Example quick flow (pre-release -> publish via automation)

1. On a feature branch, implement changes.
2. Enter pre mode if you want pre-release tagging:
    - `npx @changesets/cli pre enter --tag alpha`
3. Run `npx @changesets/cli` and follow the prompts (choose the appropriate release type).
4. Commit the changeset file(s), push the branch, and open a PR.
5. Once the PR is merged to `main`, the repository release workflow will pick up the changeset and publish the pre-release to NPM (provided `NPM_TOKEN` and workflow permissions are set).

If you have questions about changing the pre-release tag or the release automation behavior, or if you want a walkthrough of creating a test release in a fork, please open an issue or ask in the PR review comments.

## Component Versions

| Component    | Status    |
| ------------ | --------- |
| `usa-banner` | Beta      |
| `usa-link`   | Pre-alpha |
