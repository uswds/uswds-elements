import uswdsCoreStyle from "@uswds/uswds/scss/uswds-core?inline";
import usaCardStyle from "@uswds/uswds/scss/usa-card?inline";
import usaButtonStyle from "@uswds/uswds/scss/usa-button?inline";
import "../../uswds-core/system-vars.css"
import "../../uswds-core/theme-vars.css"

import { unsafeCSS, css } from "lit";

export const cardStyles = [
  unsafeCSS(uswdsCoreStyle),
  unsafeCSS(usaCardStyle),
  unsafeCSS(usaButtonStyle),
  css`
    :host {
      --usa-theme-card-border-color: var(--usa-system-color-base-lighter);
      --usa-theme-card-border-radius: var(--usa-system-border-radius-lg);
      --usa-theme-card-border-width: 2px;
      --usa-theme-card-gap: var(--usa-system-spacing-2);
      /* --usa-theme-card-flag-min-width: var(--usa-spacing-larger-tablet); */ /* Unable to use var in media query */
      --usa-theme-card-flag-image-width: var(--usa-system-unit-tablet);
      --usa-theme-card-font-family: var(--usa-theme-font-body);
      --usa-theme-card-header-font-family: var(--usa-theme-font-header);
      --usa-theme-card-margin-bottom: var(--usa-system-unit-4);
      --usa-theme-card-padding-perimeter: var(--usa-system-unit-3);
      --usa-theme-card-padding-y: var(--usa-system-unit-2);

      --border-calc: calc(var(--usa-theme-card-border-radius) - var(--usa-theme-card-border-width));
    }

    /* ALTERNATE approach to classes exdent classes ? */
    /* :host([exdent]) {
      .usa-card__header,
      .usa-card__media,
      .usa-card__body,
      .usa-card__footer {
        margin-top: calc(var(--usa-theme-card-border-width) * -1);
        margin-inline: calc(var(--usa-theme-card-border-width) * -1);
      }
    } */
    
    .usa-card {
      margin-bottom: var(--usa-theme-card-margin-bottom)
    }

    .usa-card__header > h2 {
      color: red;
    }

    .usa-button {
      background-color: red;
    }

    .usa-card__container {
      border-color: var(--usa-theme-card-border-color);
      border-radius: var(--usa-theme-card-border-radius);
      border-width: var(--usa-theme-card-border-width);
      font-family: var(--usa-theme-card-font-family);
      margin-left: calc(var(--usa-theme-card-gap) / 2);
      margin-right: calc(var(--usa-theme-card-gap) / 2);
    }

    .usa-card:not(.usa-card--flag) .usa-card__container > :only-child {
      padding: var(--usa-theme-card-padding-perimeter);
    }

    .usa-card__header {
      padding: var(--usa-theme-card-padding-perimeter);
      padding-bottom: calc(var(--usa-theme-card-padding-y) / 2);

      &:last-child {
        padding-bottom: var(--usa-theme-card-padding-perimeter);
      }
    }

    .usa-card__heading {
      font-family: var(--usa-theme-card-header-font-family);
    }

    .usa-card__header--exdent,
    .usa-card__media--exdent,
    .usa-card__body--exdent,
    .usa-card__footer--exdent {
      margin-top: calc(var(--usa-theme-card-border-width) * -1);
      margin-inline: calc(var(--usa-theme-card-border-width) * -1);
    }

    .usa-card__image::slotted(img) {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-top-left-radius: var(--border-calc);
      border-top-right-radius: var(--border-calc);
    }

    .usa-card__body {
      padding-inline: var(--usa-theme-card-padding-perimeter);
      padding-bottom: calc(var(--usa-theme-card-padding-y) / 2);
      padding-top: calc(var(--usa-theme-card-padding-y) / 2);

      &:first-child {
        padding-top: var(--usa-theme-card-padding-perimeter);
      }

      &:last-child {
        padding-bottom: var(--usa-theme-card-padding-perimeter);
      }

      &:only-child {
        padding-top: var(--usa-theme-card-padding-perimeter);
        padding-bottom: var(--usa-theme-card-padding-perimeter);
      }
    }

    .usa-card__footer {
      padding-top: calc(var(--usa-theme-card-padding-y) / 2);
      padding-inline: var(--usa-theme-card-padding-perimeter);
      padding-bottom: var(--usa-theme-card-padding-perimeter);
    }

    .usa-card--flag {
      @media (min-width: 40em) {
        .usa-card__media {
          width: var(--usa-theme-card-flag-image-width);
        }

        .usa-card__media--inset {
          padding-bottom: var(--usa-theme-card-padding-perimeter);
        }

        &.usa-card--header-first {
          .usa-card__media--inset {
            padding-top: var(--usa-theme-card-padding-perimeter);
          }
        }

        &.usa-card--media-right {
          .usa-card__media--inset {
            padding-right: var(--usa-theme-card-padding-perimeter);
          }
        }

        .usa-card__header,
        .usa-card__body,
        .usa-card__footer {
          margin-left: var(--usa-theme-card-flag-image-width);
        }
      }
    }

    // TODO: Test and remove ↓↓↓
    /* Cannot target nested header */
    .card-heading::slotted(div) {
      font-family: var(--usa-theme-card-header-font-family);
      line-height: 1.2;
      margin: 0px;
    }

    ::slotted(:is(p, h1, h2, h3, h4, h5)) {
      margin: 0;
    }
  `
]
