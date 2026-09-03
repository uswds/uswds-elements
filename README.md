> [!CAUTION]
> This repository hosts development work for the HTML Web Component version of the U.S. Web Design System, called USWDS Elements (some call it USWDS 4.0). This code may not all be suitable for production use. Work on USWDS Elements is currently taking a gradual, community-driven iterative approach to development. Everything in this repository is in a different state of development, with USWDS Banner always intended to be closest to stable due to its [inclusion in the Federal Website Standards](https://standards.digital.gov/standards/banner/), which are required by the [21st Century Integrated Digital Experience Act](https://digital.gov/resources/delivering-digital-first-public-experience#what-is-21st-century-idea) (21st Century IDEA), and reinforced by [OMB Memo M-23-22](<[https://bidenwhitehouse.archives.gov/omb/management/ofcio/delivering-a-digital-first-public-experience/](https://bidenwhitehouse.archives.gov/omb/management/ofcio/delivering-a-digital-first-public-experience/#III)>). The documentation of each item will include its current status — for components, check the `docs.mdx` in `/src/components/[usa-component-name]`.

# USWDS Elements

The [United States Web Design System](https://designsystem.digital.gov) is a toolkit of principles, guidance, and code — a library of public domain and open source user interface components and a visual style guide designed for U.S. federal government websites, but useful in many other applications.

This repository contains the code for the Web Component-based version of the design system, which is currently in pre-release status. We maintain other repositories for the [current version of the design system](https://github.com/uswds/uswds), which we call USWDS Core, as well as [its documentation and website](https://github.com/uswds/uswds-site). For USWDS Core and its documentation, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

We're working on incrementally building new [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)-based implementations of USWDS Core components. Once each new USWDS Elements Web Component progresses into production-ready mode, you'll be able to use them alongside existing USWDS code. You can try out the first published example of a USWDS Web Component variant now: the [USWDS Banner Web Component variant](https://designsystem.digital.gov/components/banner/#banner-web-component-2).

Contributions are now welcome, though the USWDS Elements review process prioritizes [USWDS Open Source Community member](https://github.com/uswds/uswds/blob/develop/COMMUNITY.md#communitymd) and [USWDS partnership](https://github.com/uswds/uswds/blob/develop/COMMUNITY.md#uswds-current--former-partners) contributions.

- [For context, here's our Architectural Decision Record explaining why system development is focusing on Web Components](https://github.com/uswds/uswds-proposals/blob/main/decisions/0001-use-web-components.md)

## Upgrading to Web Components

We're releasing these USWDS Web Components (USWDS Elements) as soon as each is ready so they can be added gradually to existing sites currently using USWDS Core (3.x). If you aren't currently using USWDS or you're using a version older than the USWDS 3, we recommend adopting version 3 in the near term rather than waiting until all of USWDS Elements is production-ready.

## Installation using node and npm

1. Install `node/npm`. Be sure to use the right install method for your operating system:
    - Node (see [.nvmrc](https://github.com/uswds/uswds-elements/blob/develop/.nvmrc) for version number), [Installation guides](https://nodejs.org/en/download)

    **Note for Windows users:** If you're using Windows but aren't familiar with Node or npm, we recommend following [Team Treehouse's tutorial](http://blog.teamtreehouse.com/install-node-js-npm-windows) for more information or [installing and running your project from Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm)

2. Make sure you installed it correctly:

    ```shell
    npm -v
    10.9.4 # This line may vary depending on which version of Node you've installed.
    ```

3. Create a `package.json` file. You can do this manually, but it's easier to use the `npm init` command, which will prompt you with a few questions to create your `package.json` file.

4. Add `@uswds/uswds` to your project’s `package.json`:

    ```shell
    npm install -S @uswds/elements
    ```

The `@uswds/elements` module is now installed as a dependency.

**Note:** We do _not_ recommend directly editing the design system files in `node_modules`. If you do that, you'll lose one of the major benefits of using a package manager — its ease of upgrade and installation. If you customize files in the package, any upgrade or re-installation will wipe out those changes.

## Using USWDS Elements in your project

How you add a USWDS Elements component to a page might vary, depending on your tools. If you use Vite, you can add components by importing them into a script that's imported elsewhere into a page:

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

Each USWDS Element component provides support for theming by exposing CSS custom properties (CSS variables) that you can use to control the appearance of the component.

Interactive form controls in our Storybook instance demonstrate how to use the theming variables, provide custom text, and otherwise customize the components.

For example, the `usa-banner` component can be customized by setting the `--usa-banner-background-color` CSS variable to a different color:

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

**Note:** Don't forget the accessibility implications of customizing. It's **your** responsibility to make sure all your changes meet the [accessibility requirements](https://designsystem.digital.gov/accessibility/) of the design system and pass all [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [Section 508](https://www.section508.gov/) accessibility tests. Accessibility is a **legal requirement**.

## Documentation

For more detailed documentation, refer to the Storybook for USWDS Elements. You can visit the most up-to-date Storybook documentation at [this preview on Cloud.gov Pages](https://federalist-ab6c0bdb-eccd-4b26-bb5f-b0154661e999.sites.pages.cloud.gov/site/uswds/web-components/?path=/docs/readme--docs). These USWDS documentation sources do get out of sync sometimes: typically Storybook is more sandbox-y and experimental, so often doesn't match other USWDS documentation.

## Browser support

USWDS supports older and newer browsers through [progressive enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement). The current major version of USWDS Elements (alpha) follows the [2% rule](https://gds.blog.gov.uk/2012/01/25/support-for-browsers/): we officially support any browser above 2% usage as observed by [analytics.usa.gov](https://analytics.usa.gov/). Currently, this means support for the newest versions of Chrome, Firefox, and Safari.

## Accessibility

The design system also meets the [WCAG 2.0 AA accessibility guidelines](https://www.w3.org/TR/WCAG20/) and conforms to the standards of [Section 508 of the Rehabilitation Act](http://www.section508.gov/), with one current exception: [input mask](https://designsystem.digital.gov/components/input-mask/). Additionally, we try to meet the requirements of [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

We use the following tools to ensure USWDS is accessible:

- [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html)
- [Axe core](https://www.deque.com/axe/)
- [Axe dev tools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US)

If you find any issues with USWDS's accessibility conformance, please create an issue in our GitHub repo or send us an email at [uswds@gsa.gov](mailto:uswds@gsa.gov). We prioritize accessibility issues. See [the Accessibility page of our website](https://designsystem.digital.gov/documentation/accessibility/) for more information.

## Publishing

This repository is automatically published to NPM when a new release is created.

We use Changesets to manage changelogs, version bumps, pre-releases (alpha/beta), and automated publishing via GitHub Actions. The repository includes a pre-configured Changesets setup so you can create pre-releases (for example, `alpha`) and standard releases.

This is an npm workspaces monorepo: alongside the root `@uswds/elements` package, `packages/tokens` is published separately as `@uswds/tokens`. Each workspace package is versioned and released independently through the same Changesets flow described below — a changeset can target one or more packages, and only the packages it lists get a version bump.

### Pre-release flow

If you're working on a pre-release version, enter pre-release mode:

```bash
   npx @changesets/cli pre enter <tag> # for example, npx @changesets/cli pre enter alpha
```

This writes a `.changeset/pre.json` that configures the pre-release tag and initial version. This file should be committed to the repository.

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

    - The command creates a file under the `.changeset/` directory that describes the packages and the release type (patch/minor/major). You can edit this file to add more details, such as a link to the issue or pull request that the change addresses. The file will automatically get a nonsensical name like `fire-penguin-annex.md`, which is normal. These files are only in the repository temporarily, to generate changelogs and version bumps. They aren't published to NPM and get cleaned up after the release is published.

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
    - The workflow runs on pushes to `main` and uses the Changesets GitHub Action
    - The action can either create a release PR or publish directly to NPM depending on repository and action settings
    - The workflow uses repository secrets:
        - `GITHUB_TOKEN` — standard workflow permission for the action to create PRs/commits
    - The action is configured to run the project’s release script (for example `npm run release`) in a controlled environment; it will also disable Husky hooks during automated runs (HUSKY=0) to avoid local commit hooks blocking automation

#### Notes, tips, and troubleshooting

- Ensure your changeset accurately reflects the semantic change (patch/minor/major). Changesets drives the version bump and changelog generation.
- Pre-release flows:
    - The repository includes a `.changeset/pre.json` configuration that sets a default pre-release tag (e.g., `alpha`) and initial versions for pre-release packages. Use `npx @changesets/cli pre enter  <tag>` to begin a pre-release cycle.
    - When in pre mode, version bumps will produce pre-release identifiers (for example, `1.0.0-alpha.1`).
- CI vs local publish:
    - For most contributors, pushing a properly authored changeset and opening a PR is the recommended route—automation, which will create the release or open the release PR for maintainers to review
    - If you have to publish locally, make sure `NPM_TOKEN` is configured in your environment or use a CI/protected account to run the publish steps
- If releases aren't being published as expected:
    - Verify `NPM_TOKEN` exists in repository secrets and has publish scope
    - Ensure the commit/push to `main` contains a changeset (or the automation has been triggered by the Changesets action)
    - Review the release workflow logs in GitHub Actions for details (it'll show the changesets step and any publishing errors)
- If you want to change the default pre-release tag (for example, from `alpha` to `beta`), update the `.changeset/pre.json` file and follow the pre-mode steps above

Example quick flow (pre-release -> publish via automation):

1. On a feature branch, implement changes
2. Enter pre mode if you want pre-release tagging:
    - `npx @changesets/cli pre enter --tag alpha`
3. Run `npx @changesets/cli` and follow the prompts (choose the appropriate release type)
4. Commit the changeset file(s), push the branch, and open a PR
5. Once the PR is merged to `main`, the repository release workflow will pick up the changeset and publish the pre-release to NPM (as long as `NPM_TOKEN` and workflow permissions are set)

If you have questions about changing the pre-release tag or the release automation behavior, or if you want a walkthrough of creating a test release in a fork, please open an issue or ask in the PR review comments.

## Component versions

| Component    | Status                                                                          |
| ------------ | ------------------------------------------------------------------------------- |
| `usa-banner` | Beta (Banner only, not entire package)                                          |
| `usa-link`   | Pre-alpha (proof-of-concept: not intended as direction, or even for release)    |
| `usa-alert`  | Pre-alpha (proof-of-concept for architecture validation; not completely tested) |
