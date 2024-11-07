import { LitElement, css, html } from "lit";
import styles from "./usa-text-input.css.js";

/**
 * @summary The usa-text-input component.
 *
 * @slot - This element has a slot
 *
 * @cssprop --theme-input-line-height - Sets the line-height of input element
 * @cssprop --theme-input-max-width - Sets the max width of the input element
 * @cssprop --theme-input-state-border-width - Sets the border width of error and success states.
 *
 * @tagname usa-text-input
 */
export class UsaTextInput extends LitElement {
  static styles = [styles];

  connectedCallback() {
    super.connectedCallback();
    this.label = this.querySelector("label");
    this.input = this.querySelector("input");
  }

  constructor() {
    super();
  }

  render() {
    if (this.label) {
      this.label.classList.add("usa-label");
    }

    if (this.input) {
      this.input.classList.add("usa-input");
    }

    return html` ${this.label} ${this.input} `;
  }
}

window.customElements.define("usa-text-input", UsaTextInput);
