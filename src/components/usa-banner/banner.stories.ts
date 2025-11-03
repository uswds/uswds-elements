import "./index";
import ComponentDocs from "./docs.mdx";
import { expect, userEvent, waitFor } from "storybook/test";
import { within } from "shadow-dom-testing-library";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { Args, ArgTypes } from "storybook/internal/csf";

const { argTypes, args, template } = getStorybookHelpers("usa-banner");

const filteredArgTypes = (argTypes: ArgTypes) => {
  const filtered: ArgTypes = {};

  for (const [key, value] of Object.entries(argTypes)) {
    // Disable methods and isOpen
    if (value.table?.category === "methods" || key === "isOpen") {
      filtered[key] = {
        ...value,
        table: {
          ...value.table,
          disable: true,
        },
      };
    } else {
      filtered[key] = value;
    }
  }

  return filtered;
};

export default {
  title: "Components/Banner",
  component: "usa-banner",
  tags: ["beta"],
  args: {
    ...args,
    label: "",
    tld: "gov",
    lang: "en",
  },
  parameters: {
    docs: {
      page: ComponentDocs,
    },
  },
  argTypes: filteredArgTypes(argTypes),
  render: (args: Args) => template(args),
};

export const Default = {};

export const CustomContent = {
  argTypes: {
    tld: { table: { disable: true } },
    lang: { table: { disable: true } },
  },
  args: {
    label: "Un site Web officiel du gouvernement américain",
    /**
     * The `getStorybookHelpers` function from @wc-toolkit/storybook-helpers`
     * automatically appends the `slot` attribute to avoid collisions with other props.
     *
     * To set the content for this story, the key should have the suffix `-slot`,
     * even though the slot name in the component is `banner-text`, `banner-action`, etc.
     */
    "banner-text-slot": "Un site Web officiel du gouvernement américain",
    "banner-action-slot": "Voici comment vous le savez",
    "domain-heading-slot": "Les sites Web officiels utilisent .gov",
    "domain-text-slot":
      "Un site Web .gov appartient à une organisation gouvernementale officielle aux États-Unis.",
    "https-heading-slot": "Les sites Web .gov sécurisés utilisent HTTPS",
    "https-text-slot": `Un <strong>verrou</strong> ( <span class="usa-banner__icon-lock" role="img" aria-label="Icône de cadenas verrouillé"></span> ) ou <strong>https://</strong> signifie que vous êtes connecté(e) en toute sécurité au site Web .gov. Assurez-vous de ne partager des informations sensibles que sur des sites Web officiels et sécurisés.`,
  },
};

export const Mil = {
  args: {
    tld: "mil",
  },
};

export const EspañolGov = {
  args: {
    lang: "es",
  },
};

export const EspañolMil = {
  args: {
    lang: "es",
    tld: "mil",
  },
};

export const CustomThemeExample = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  args: {
    "--usa-banner-background-color": "#0f191c", // blue-cool-90
    "--usa-banner-button-close-background-color": "#002d3f", // blue-cool-80-vivid
    "--usa-banner-focus-outline-color": "#52daf2", // cyan-20-vivid
    "--usa-banner-font-family":
      "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
    "--usa-banner-link-hover-color": "#c3ebfa", // blue-cool-10-vivid
    "--usa-banner-text-color": "#ffffff",
    "--usa-banner-link-color": "#97d4ea", // blue-cool-20-vivid
  },
};

export const ToggleBannerTest = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByShadowRole("button");
    const dotGovText = canvas.getByShadowText("Official websites use .gov");

    await userEvent.click(button);
    await waitFor(() => {
      expect(dotGovText).toBeVisible();
    });

    await userEvent.click(button);
    await waitFor(() => {
      expect(dotGovText).not.toBeVisible();
    });
  },
};
