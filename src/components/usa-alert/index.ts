import { css, html, LitElement, nothing } from "lit";
import {
  customElement,
  property,
  queryAssignedNodes,
  state,
} from "lit/decorators.js";
import stylesBaseVariables from "./base-variables.css";
import styles from "./ogds-alert.css";

/**
 * @summary The usa-alert component.
 *
 * @attribute {string} type - The type of alert (info, warning, etc)
 * @attribute {string} noIcon - Use this attribute to hide the icon
 *
 * @slot heading - Text for the heading. Make sure to specify the correct heading level (h2, h3, etc)
 * @slot content - Body content for the alert. Can contain HTML (links, etc).
 *
 * @tagname usa-alert
 */

@customElement("usa-alert")
export class MDAlert extends LitElement {
  @property({ type: String })
  type = "info";

  @property({ type: Boolean, attribute: "no-icon" })
  accessor noIcon = false;

  @queryAssignedNodes({ slot: "heading", flatten: true })
  _headingNodes!: Array<Node>;

  @state()
  private accessor _hasHeader = false;

  slotChange() {
    this._hasHeader = this._headingNodes.length > 0;
  }

  static styles = [
    css`
      :host {
        /** Icons */
        --usa-icon-check-circle: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
        --usa-icon-warning: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'/%3E%3C/svg%3E");
        --usa-icon-info: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' /%3E%3C/svg%3E");
        --usa-icon-error: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
      }
    `,
    stylesBaseVariables,
    styles,
  ];

  render() {
    return html`
      <div class="usa-alert usa-alert--${this.type} ${this.noIcon ? "usa-alert--no-icon" : ""} ${this._hasHeader ? "" : "usa-alert--slim"}">
        <div class="usa-alert__body">
          <div class="usa-alert__heading" style="${this._hasHeader ? "" : "display:none;"}">
            <img class="usa-alert__icon" aria-hidden="true"></img>
            <div>
              <slot name="heading" @slotchange=${() => this.slotChange()}></slot>
            </div>
          </div>
          <p class="usa-alert__text">
            ${
              this._hasHeader
                ? nothing
                : html`<img class="usa-alert__icon" aria-hidden="true"></img>`
            }
            <slot name="content"></slot>
            <slot></slot>
          </p>
        </div>
      </div>
    `;
  }
}