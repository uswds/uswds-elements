import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";

import styles from "./usa-alert.css";
import iconClose from "../../shared/icons/close.svg";
import { defineCustomElement } from "../../utils";

const VALID_STATUSES = [
  "info",
  "warning",
  "error",
  "success",
  "emergency",
] as const;

type AlertStatus = (typeof VALID_STATUSES)[number];

/**
 * @summary Displays important messages to the user with contextual status styling.
 *
 * @attribute {"info" | "warning" | "error" | "success" | "emergency"} status - Determines the icon and border/background color.
 * @attribute {boolean} slim - Displays the slim variation (smaller icon, no heading).
 * @attribute {boolean} no-icon - Hides the status icon.
 * @attribute {boolean} closeable - Shows a close button.
 * @attribute {string} close-label - Aria-label for the close button. Defaults to "Close alert".
 *
 * @cssprop --usa-alert-background-color - Override background color.
 * @cssprop --usa-alert-border-color - Override left border color.
 * @cssprop --usa-alert-icon-color - Override icon color.
 * @cssprop --usa-alert-icon-size - Override icon size.
 * @cssprop --usa-alert-padding-x - Override horizontal padding.
 * @cssprop --usa-alert-padding-y - Override vertical padding.
 * @cssprop --usa-alert-font-family - Override font family.
 * @cssprop --usa-alert-text-color - Override text color.
 *
 * @slot headline - The alert heading (use an h-element: h2, h3, etc.).
 * @slot - Default slot for alert body content.
 *
 * @fires close - Dispatched when the close button is clicked.
 *
 * @element usa-alert
 */
export class UsaAlert extends LitElement {
  static properties = {
    status: { type: String, reflect: true },
    slim: { type: Boolean, reflect: true },
    noIcon: { type: Boolean, attribute: "no-icon", reflect: true },
    closeable: { type: Boolean, reflect: true },
    closeLabel: { type: String, attribute: "close-label" },
    _visible: { state: true },
  };

  status!: AlertStatus;
  slim!: boolean;
  noIcon!: boolean;
  closeable!: boolean;
  closeLabel!: string;
  _visible!: boolean;

  constructor() {
    super();
    this.status = "info";
    this.slim = false;
    this.noIcon = false;
    this.closeable = false;
    this.closeLabel = "Close alert";
    this._visible = true;
  }

  private get #role(): string {
    if (
      this.status === "error" ||
      this.status === "emergency" ||
      this.status === "warning"
    ) {
      return "alert";
    }
    return "status";
  }

  private _handleClose() {
    this.dispatchEvent(
      new CustomEvent("close", { bubbles: true, composed: true }),
    );
    this._visible = false;
  }

  static styles = [
    css`
      :host {
        --usa-icon-close: url("${unsafeCSS(iconClose)}");
      }
    `,
    styles,
  ];

  render() {
    if (!this._visible) {
      return nothing;
    }

    const status = VALID_STATUSES.includes(this.status) ? this.status : "info";

    const classes = {
      "usa-alert": true,
      [`usa-alert--${status}`]: true,
      "usa-alert--slim": this.slim,
      "usa-alert--no-icon": this.noIcon,
    };

    return html`
      <div class="${classMap(classes)}" role="${this.#role}">
        <div class="usa-alert__body">
          ${!this.slim ? html`<slot name="headline"></slot>` : null}
          <div class="usa-alert__text">
            <slot></slot>
          </div>
        </div>
        ${this.closeable
          ? html`
              <button
                class="usa-alert__close"
                type="button"
                aria-label="${this.closeLabel}"
                @click="${this._handleClose}"
              >
                <span class="usa-alert__close-icon"></span>
              </button>
            `
          : null}
      </div>
    `;
  }
}

defineCustomElement("usa-alert", UsaAlert);
