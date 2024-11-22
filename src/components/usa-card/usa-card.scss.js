import "../../uswds-core/system-vars.css"
import "../../uswds-core/theme-vars.css"

import {  css } from "lit";

export const cardStyles = [
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

      display: flex;
      flex-direction: column;
      background-color: white;
      color: var(--usa-theme-color-ink);
      margin-bottom: var(--usa-theme-card-margin-bottom);
      border-color: var(--usa-theme-card-border-color);
      border-radius: var(--usa-theme-card-border-radius);
      border-style: solid;
      border-width: var(--usa-theme-card-border-width);
      font-family: var(--usa-theme-card-font-family);
      margin-left: calc(var(--usa-theme-card-gap) / 2);
      margin-right: calc(var(--usa-theme-card-gap) / 2);
    }

    ::slotted([slot="card-header"]) {
      padding: var(--usa-theme-card-padding-perimeter);
      padding-bottom: calc(var(--usa-theme-card-padding-y) / 2);

      // ? is this doing anything? Compare to uswds styles
      &:last-child {
        padding-bottom: var(--usa-theme-card-padding-perimeter);
      }
    }
    
    // ? Unable to figure out how to style parts in this file
    :host::part("card-heading") {
      font-family: var(--usa-theme-card-header-font-family);
      background-color: red;
    }

    ::part("card-heading") {
      font-family: var(--usa-theme-card-header-font-family);
      background-color: red;
    }
    h2[part="card-heading"] {
      font-family: var(--usa-theme-card-header-font-family);
    }

    .usa-card:not(.usa-card--flag) .usa-card__container > :only-child {
      padding: var(--usa-theme-card-padding-perimeter);
    }

    ::slotted([slot="card-media"]) {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
      overflow: hidden;
      order: -1;
      position: relative;
      border-top-left-radius: var(--border-calc);
      border-top-right-radius: var(--border-calc);
      box-sizing: border-box;
    }

    ::slotted([slot="card-media"][inset]) {
      padding-top: var(--usa-theme-card-padding-perimeter);
      padding-left: var(--usa-theme-card-padding-perimeter);
      padding-right: var(--usa-theme-card-padding-perimeter);
    }

    ::slotted([exdent]) {
      margin-top: calc(var(--usa-theme-card-border-width) * -1);
      margin-left: calc(var(--usa-theme-card-border-width) * -1);
      margin-right: calc(var(--usa-theme-card-border-width) * -1);
    }

    ::slotted(:not([slot])) {
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

    ::slotted([slot="card-footer"]) {
      padding-top: calc(var(--usa-theme-card-padding-y) / 2);
      padding-inline: var(--usa-theme-card-padding-perimeter);
      padding-bottom: var(--usa-theme-card-padding-perimeter);
    }

    :host([layout="flag"]) {
      @media (min-width: 40em) {

        ::slotted([slot="card-media"]) {
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

        ::slotted(:not([slot="card-media"])) {
          margin-left: var(--usa-theme-card-flag-image-width);
        }
      }
    }
  `
]
