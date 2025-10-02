import type { CSSResultGroup } from "lit";
import { css } from "lit";

export const bannerStyles: CSSResultGroup = [
  css`
    :host {
      /** Global tokens */
      --usa-spacing-05: 0.25rem;
      --usa-spacing-1: 0.5rem;
      --usa-spacing-2: 1rem;
      --usa-spacing-3: 1.5rem;
      --usa-spacing-4: 2rem;
      --usa-spacing-5: 2.5rem;
      --usa-spacing-6: 3rem;
      --usa-size-touch-target: 3rem;
      --usa-site-margins-mobile-width: 1rem;
      --usa-site-margins-width: 2rem;
      --usa-breakpoint-tablet: 40rem;
      --usa-breakpoint-desktop: 64rem;
      /** Component tokens */
      --usa-banner-background-color: var(--usa-color-base-lightest, #f0f0f0);
      --usa-banner-button-close-background-color: var(
        --usa-color-base-lighter,
        #dfe1e2
      );
      --usa-banner-focus-outline-color: var(--usa-color-blue-vivid-40, #2491ff);
      --usa-banner-font-family:
        system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;
      --usa-banner-font-size-xs: 0.75rem;
      --usa-banner-font-size-sm: 0.875rem;
      --usa-banner-font-size-base: 0.94rem;
      --usa-banner-line-height-sm: 1.2;
      --usa-banner-line-height-base: 1.6;
      --usa-banner-link-color: var(--usa-color-blue-vivid-60, #005ea2);
      --usa-banner-link-hover-color: var(
        --usa-color-blue-warm-vivid-70,
        #1a4480
      );
      --usa-banner-max-width: var(--usa-breakpoint-desktop);
      --usa-banner-text-color: var(--usa-color-base-darkest, #1b1b1b);
      /** Icons */
      --usa-icon-close: url("/src/shared/icons/close.svg");
      --usa-icon-expand-less: url("/src/shared/icons/expand_less.svg");
      --usa-icon-expand-more: url("/src/shared/icons/expand_more.svg");
      --usa-icon-lock: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='64' viewBox='0 0 52 64' class='usa-banner__lock-image' role='img' aria-labelledby='banner-lock-description-default' focusable='false'%3E%3Ctitle id='banner-lock-title-default'%3ELock%3C/title%3E%3Cdesc id='banner-lock-description-default'%3ELocked padlock icon%3C/desc%3E%3Cpath fill='%23000000' fill-rule='evenodd' d='M26 0c10.493 0 19 8.507 19 19v9h3a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4h3v-9C7 8.507 15.507 0 26 0zm0 8c-5.979 0-10.843 4.77-10.996 10.712L15 19v9h22v-9c0-6.075-4.925-11-11-11z'%3E%3C/path%3E%3C/svg%3E");
    }

    * {
      box-sizing: border-box;
    }

    section {
      background-color: var(--usa-banner-background-color);
      box-sizing: border-box;
      font-family: var(--usa-banner-font-family);
      font-size: var(--usa-banner-font-size-xs);
    }

    section *,
    section *::before,
    section *::after {
      box-sizing: border-box;
    }

    @media (min-width: 40em) {
      section {
        font-size: var(--usa-banner-font-size-xs);
        padding-block-end: 0;
      }
    }

    section .usa-accordion {
      font-family: inherit;
    }

    section .grid-row {
      display: grid;
      /* This creates a responsive grid where: */
      /* - Columns auto-fit based on available space */
      /* - Each column has a minimum width that's the smaller of 100% or half the tablet breakpoint (20rem) */
      /* - Columns can grow to fill remaining space (1fr) */
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, calc(var(--usa-breakpoint-tablet) / 2)), 1fr)
      );
    }

    @media (min-width: 40em) {
      section .grid-row {
        gap: var(--usa-spacing-2);
      }
    }

    @media (min-width: 64em) {
      section .grid-row {
        gap: calc(var(--usa-spacing-05) / 2);
      }
    }

    .grid-col-auto {
      flex: 0 1 auto;
    }

    .grid-col-fill {
      flex: 1 1 0;
      max-width: 100%;
      min-width: 1px;
      width: auto;
    }

    @media (min-width: 40em) {
      .tablet\\:grid-col-auto {
        flex: 0 1 auto;
        max-width: 100%;
        width: auto;
      }
    }

    section .tablet\\:grid-col-6 {
      flex: 0 0 auto;
      gap: var(--usa-spacing-1);
      width: 100%;
    }

    header,
    .content {
      color: var(--usa-banner-text-color);
    }

    .content {
      font-size: var(--usa-banner-font-size-base);
      line-height: var(--usa-banner-line-height-base);
      margin-inline: auto;
      max-width: var(--usa-banner-max-width);
      overflow: hidden;
      padding-block-end: var(--usa-spacing-2);
      padding-block-start: var(--usa-spacing-05);
      padding-inline: var(--usa-spacing-1);
      width: 100%;
    }

    @media (min-width: 40em) {
      .content {
        padding-block: var(--usa-spacing-3);
      }
    }

    @media (min-width: 64em) {
      .content {
        padding-inline: var(--usa-spacing-4);
      }
    }

    .content p:first-child {
      margin: 0;
    }

    .inner {
      align-items: flex-start;
      display: flex;
      flex-wrap: nowrap;
      margin-inline: auto;
      max-width: var(--usa-banner-max-width);
      padding-inline-end: 0;
      padding-inline-start: var(--usa-spacing-2);
    }

    @media (min-width: 40em) {
      .inner {
        align-items: center;
      }
    }

    @media (min-width: 64em) {
      .inner {
        padding-inline: var(--usa-spacing-4);
      }
    }

    header {
      font-size: var(--usa-banner-font-size-xs);
      font-weight: 400;
      min-height: var(--usa-size-touch-target);
      padding-block: var(--usa-spacing-1);
      position: relative;
    }

    @media (min-width: 40em) {
      header {
        min-height: 0;
        padding-block: var(--usa-spacing-05);
      }
    }

    .header-text {
      font-size: var(--usa-banner-font-size-xs);
      line-height: var(--usa-banner-line-height-sm);
      margin-block: 0;
    }

    .header-flag {
      float: left;
      margin-inline-end: var(--usa-spacing-1);
      padding-block-start: 0;
      width: var(--usa-spacing-2);
    }

    .header-action {
      background: none;
      border: none;
      color: var(--usa-banner-link-color);
      cursor: pointer;
      font: inherit;
      line-height: var(--usa-banner-line-height-sm);
      margin-block-end: 0;
      margin-block-start: 2px;
      padding: 0;
      text-decoration: underline;
    }

    .header-action:hover {
      color: var(--usa-banner-link-hover-color);
    }

    .header-action::after {
      background-color: currentColor;
      content: "";
      display: inline-block;
      height: 1rem;
      mask-image: var(--usa-icon-expand-more);
      mask-position: center;
      mask-repeat: no-repeat;
      mask-size: 1rem 1rem;
      vertical-align: middle;
      width: 1rem;
    }

    .expanded .header-action {
      display: none;
    }

    @media (min-width: 40em) {
      .header-action {
        display: none;
      }
    }

    @media (forced-colors: active) {
      .header-action {
        color: LinkText;
      }

      .header-action::after {
        background-color: ButtonText;
      }
    }

    header.expanded {
      padding-inline-end: calc(
        var(--usa-size-touch-target) + var(--usa-spacing-1)
      );
    }

    @media (min-width: 40em) {
      header.expanded {
        display: block;
        font-size: var(--usa-banner-font-size-sm);
        font-weight: 400;
        min-height: 0;
        padding-inline-end: 0;
      }
    }

    header.expanded .inner {
      margin-inline-start: 0;
    }

    @media (min-width: 40em) {
      header.expanded .inner {
        margin-inline-start: auto;
      }
    }

    header.expanded .header-action {
      display: none;
    }

    button {
      background: none;
      border: none;
      bottom: 0;
      color: var(--usa-banner-link-color);
      cursor: pointer;
      display: block;
      font: inherit;
      font-size: var(--usa-banner-font-size-xs);
      height: auto;
      left: 0;
      line-height: var(--usa-banner-line-height-sm);
      outline: inherit;
      padding: 0;
      padding-block-start: 0;
      padding-inline-start: 0;
      position: absolute;
      text-decoration: none;
      top: 0;
      width: auto;
    }

    button:hover {
      color: var(--usa-banner-link-hover-color);
    }

    @media (max-width: 39.99em) {
      button {
        width: 100%;
      }

      button:enabled:focus {
        outline-offset: -0.25rem;
      }
    }

    button:not([disabled]):focus {
      outline: var(--usa-spacing-05) solid var(--usa-banner-focus-outline-color);
    }

    @media (min-width: 40em) {
      button {
        bottom: auto;
        display: inline;
        left: auto;
        margin-inline-start: var(--usa-spacing-1);
        position: relative;
        top: auto;
      }

      button::after {
        background-color: currentColor;
        content: "";
        display: inline-block;
        height: 1rem;
        margin-block: 0;
        mask-image: var(--usa-icon-expand-more);
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: contain;
        position: absolute;
        right: -18px;
        top: 0;
        width: 1rem;
      }

      button:hover {
        text-decoration: none;
      }
    }

    @media (forced-colors: active) {
      button::after,
      button:hover::after {
        background-color: ButtonText;
      }
    }

    button[aria-expanded="false"],
    button[aria-expanded="false"]:hover,
    button[aria-expanded="true"],
    button[aria-expanded="true"]:hover {
      background-image: none;
    }

    @media (forced-colors: active) {
      button[aria-expanded="false"]::before,
      button[aria-expanded="false"]:hover::before,
      button[aria-expanded="true"]::before,
      button[aria-expanded="true"]:hover::before {
        content: none;
      }
    }

    @media (max-width: 39.99em) {
      button[aria-expanded="true"]::before {
        background-color: var(--usa-banner-button-close-background-color);
        bottom: 0;
        content: "";
        display: block;
        height: var(--usa-size-touch-target);
        position: absolute;
        right: 0;
        top: 0;
        width: var(--usa-size-touch-target);
      }

      button[aria-expanded="true"]::after {
        background-color: var(--usa-banner-link-color);
        bottom: 0;
        content: "";
        display: block;
        height: var(--usa-size-touch-target);
        mask-image: var(--usa-icon-close);
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: 1.5rem 1.5rem;
        position: absolute;
        right: 0;
        top: 0;
        width: var(--usa-size-touch-target);
      }
    }

    @media (min-width: 40em) {
      button[aria-expanded="true"] {
        height: auto;
        padding: 0;
        position: relative;
      }

      button[aria-expanded="true"]::after,
      button[aria-expanded="true"]:hover::after {
        mask-image: var(--usa-icon-expand-less);
        position: absolute;
      }
    }

    @media (forced-colors: active) {
      button[aria-expanded="true"]::after,
      button[aria-expanded="true"]:hover::after {
        background-color: ButtonText;
      }
    }

    .button-text {
      left: -999em;
      position: absolute;
      right: auto;
      text-decoration: underline;
    }

    @media (min-width: 40em) {
      .button-text {
        display: inline;
        left: auto;
        position: static;
        right: auto;
      }
    }

    @media (forced-colors: active) {
      .button-text {
        color: LinkText;
      }
    }

    .guidance {
      align-items: flex-start;
      display: flex;
      max-width: 62ex;
      padding-block-start: var(--usa-spacing-2);
    }

    @media (max-width: 39.99em) {
      .guidance {
        padding-inline-end: 0.75rem;
      }
    }

    @media (min-width: 40em) {
      .guidance {
        padding-block-start: 0;
        padding-inline-end: var(--usa-spacing-1);
      }
    }

    .icon {
      width: var(--usa-spacing-5);
    }

    .usa-media-block__img {
      width: var(--usa-spacing-5);
    }

    .usa-media-block__body {
      flex: 1;
    }

    .icon-lock {
      background-image: var(--usa-icon-lock);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      display: inline-block;
      height: 1.5ex;
      mask-image: var(--usa-icon-lock);
      mask-position: center;
      mask-repeat: no-repeat;
      mask-size: cover;
      width: 1.21875ex;
    }
  `,
];
