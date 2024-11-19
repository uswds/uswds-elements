import { LitElement, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { cardStyles } from "./usa-card.scss";

export class UsaCard extends LitElement {
  static styles = [cardStyles];

  static properties = {
    headerFirst: { 
      attribute: 'header-first',
      type: Boolean
    },
    inset: { type: Boolean },
    exdent: { type: Boolean},
    layout: { type: String },
  }
  
  constructor() {
    super();

    this.header = this.querySelector("[slot='card-header']");
    this.media = this.querySelector("[slot='card-media']")
    this.footer = this.querySelector("[slot='card-footer']");
  }

  // Render header
  headerTemplate() {
    if(!this.header) {
      return;
    }

    const classes = {
      "usa-card__header--exdent": this.exdent || this.header.hasAttribute("exdent")
    }

    return html`
      <div class="usa-card__header ${classMap(classes)}">
        <slot name="card-header"></slot>
      </div>
    `;
  }

  // Render media
  mediaTemplate() {
    if(!this.media) {
      return;
    }

    const classes = {
      "usa-card__media--inset": this.media.hasAttribute("inset") && !this.media.hasAttribute("exdent"),
      "usa-card__media--exdent": this.exdent || this.media.hasAttribute("exdent") && !this.media.hasAttribute("indent"),
    }

    return html`
    <div class="usa-card__media ${classMap(classes)}">
      <div class="usa-card__img">
        <slot name="card-media"></slot>
      </div>
    </div>
    `
  }

  /**
   * Wraps "card-body" and unnamed slots with card body markup.
   * Checks for exdent property and applies class if present.
   * 
   * 
   * @returns Card body markup
   */
  // TODO: Restore body exdent functionality without full exdent.
  bodyTemplate() {
    const classes = {
      "usa-card__body--exdent": this.exdent
    };

    return html`
      <div class="usa-card__body ${classMap(classes)}">
        <slot part="body"></slot>
      </div>
    `
  }

  // Render footer
  footerTemplate() {
    if(!this.footer) {
      return;
    }

    const classes = {
      "usa-card__footer--exdent": this.exdent || this.footer?.hasAttribute("exdent")
    }

    return html`
      <div class="usa-card__footer ${classMap(classes)}">
        <slot name="card-footer"></slot>
      </div>
    `
  }

  // Render card
  cardTemplate() {
    const classes = {
      "usa-card--header-first": this.headerFirst,
      "usa-card--flag": this.layout === "flag" || this.layout === "flag-alt",
      "usa-card--media-right": this.layout == "flag-alt",
    }
    return html`
        <div class="usa-card ${classMap(classes)}">
          <div class="usa-card__container">
            ${this.headerTemplate()}
            ${this.mediaTemplate()}
            ${this.bodyTemplate()}
            ${this.footerTemplate()}
          </div>
        </div>
    `
  }

  render() {
    return html`
        ${this.cardTemplate()}
      `
  }
}

window.customElements.define("usa-card", UsaCard);
