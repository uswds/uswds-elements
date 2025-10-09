import { LitElement, css, html } from "lit";
import styles from "./usa-link.css";

/**
 * @summary The usa-link component.
 *
 * @slot - This element has a slot
 *
 * @attribute {String} href - The url for the link
 *
 * @cssprop --theme-link-color - Sets the link color
 * @cssprop --theme-link-visited-color - Sets the color for visited links
 * @cssprop --theme-link-hover-color - Sets the hover state link color
 * @cssprop --theme-link-active-color - Sets the active state link color
 *
 * @tagname usa-link
 */
export class UsaLink extends LitElement {
  static styles = [styles];

  static properties = {
    href: {},
  };

  hasLinkChild() {
    const childLink = this.querySelector("a");
    if (!childLink) return false;

    this.href = childLink.href;
    this.slottedChildren = childLink;
    this.shadowRoot.appendChild(this.slottedChildren);
  }

  constructor() {
    super();
  }

  templateWithChildren() {
    return html`<a class="usa-link" href="${this.href}"
      >${this.slottedChildren}</a
    >`;
  }

  templateWithSlots() {
    return html`<a class="usa-link" href="${this.href}"><slot></slot></a>`;
  }

  render() {
    return this.hasLinkChild()
      ? this.templateWithChildren()
      : this.templateWithSlots();
  }
}

window.customElements.define("usa-link", UsaLink);
