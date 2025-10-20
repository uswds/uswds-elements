import "./index";
import { html, nothing } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { within } from "shadow-dom-testing-library";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

const { argTypes, args } = getStorybookHelpers("usa-banner");

export default {
  title: "Components/Banner",
  component: "usa-banner",
  args: {
    ...args,
    label: "",
    tld: "gov",
    lang: "en",
  },
  argTypes,
  render: ({ lang, label, tld, ...cssProps }) => {
    // Return only CSS variables to use in a style tag
    const cssVariables = Object.entries(cssProps)
      .filter(
        ([key, value]) => key.startsWith("--") && value != null && value !== "",
      )
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n    ");

    return html`
      ${cssVariables
        ? html`<style>
            usa-banner {
              ${cssVariables}
            }
          </style>`
        : nothing}
      <usa-banner
        lang=${lang || nothing}
        label=${label || nothing}
        tld=${tld || nothing}
      ></usa-banner>
    `;
  },
};

export const Default = {};

export const CustomContent = {
  argTypes: {
    tld: { table: { disable: true } },
    lang: { table: { disable: true } },
  },
  args: {
    label: "Un site Web officiel du gouvernement américain",
    bannerText: "Un site Web officiel du gouvernement américain",
    bannerAction: "Voici comment vous le savez",
    domainHeading: "Les sites Web officiels utilisent",
    domainText:
      "Un site Web .gov appartient à une organisation gouvernementale officielle aux États-Unis.",
    httpsHeading: "Les sites Web .gov sécurisés utilisent HTTPS",
    httpsText: `Un <strong>verrou</strong> (<span class="usa-banner__icon-lock" role="img" aria-label="Locked padlock icon"></span>) ou <strong>https://</strong> signifie que vous êtes connecté(e) en toute sécurité au site Web .gov. Assurez-vous de ne partager des informations sensibles que sur des sites Web officiels et sécurisés.`,
    tld: "mil",
  },
  render: ({
    label,
    bannerText,
    bannerAction,
    domainHeading,
    domainText,
    httpsHeading,
    httpsText,
  }) => html`
    <usa-banner label=${label || nothing}>
      <span slot="banner-text">${bannerText}</span>
      <span slot="banner-action">${bannerAction}</span>
      <span slot="domain-heading">${domainHeading}</span>
      <span slot="domain-text">${domainText}</span>
      <span slot="https-heading">${httpsHeading}</span>
      <span slot="https-text">${unsafeHTML(httpsText)}</span>
    </usa-banner>
  `,
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

export const ToggleBanner = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByShadowRole("button");
    const dotGovText = canvas.getByShadowText("Official websites use .gov");

    userEvent.click(button);
    await waitFor(() => {
      expect(dotGovText).toBeVisible();
    });

    userEvent.click(button);
    await waitFor(() => {
      expect(dotGovText).not.toBeVisible();
    });
  },
};
