import { css } from "lit";
import "../uswds-core/system-vars.css";
import "../uswds-core/theme-vars.css";

export default css`
  :host {
    --theme-input-line-height: 1.3;
    --theme-input-max-width: var(--usa-system-unit-mobile-lg);
    --theme-input-state-border-width: var(--usa-system-unit-05);

    .usa-input {
      box-sizing: border-box;
      background: var(--usa-theme-page-background-color);
      border-width: 1px;
      border-color: var(--usa-system-color-gray-cool-60);
      border-style: solid;
      border-radius: 0;
      color: var(--usa-theme-text-color);
      display: block;
      height: 2.5rem;
      margin-top: 0.5rem;
      max-width: var(--theme-input-max-width);
      padding: 0.5rem;
      width: 100%;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      font-family:
        Source Sans Pro Web,
        Helvetica Neue,
        Helvetica,
        Roboto,
        Arial,
        sans-serif;
      font-size: 1.06rem;
      line-height: var(--theme-input-line-height);
    }

    input:not([disabled]):focus,
    textarea:not([disabled]):focus {
      outline-width: var(--usa-theme-focus-width);
      outline-color: var(--usa-theme-focus-color);
      outline-style: var(--usa-theme-focus-style);
      outline-offset: var(--usa-theme-focus-offset);
    }

    .usa-label {
      color: var(--usa-theme-text-color);
      font-family:
        Source Sans Pro Web,
        Helvetica Neue,
        Helvetica,
        Roboto,
        Arial,
        sans-serif;
      font-size: 1.06rem;
      line-height: var(--theme-input-line-height);
      display: block;
      font-weight: 400;
      margin-top: var(--usa-system-unit-3);
      max-width: var(--usa-system-unit-mobile-lg);
    }
  }
`;
