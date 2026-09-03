import { LitElement, html} from "lit";
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

    this.cardGroup = this.parentElement;
    this.header = this.querySelector("[slot='card-header']");
    this.headerContent = [...this.header.children];
    this.media = this.querySelector("[slot='card-media']")
    this.body = this.querySelector("[slot='card-body']");
    this.bodyContent = [...this.body.children];
    this.footer = this.querySelector("[slot='card-footer']");
    this.footerContent = [...this.footer.children];
    this.slottedChildren = [...this.children];
    this.slots = this.slottedChildren.map((child) => {
      return child.getAttribute("slot")
    })
  }

  // Render header
  headerTemplate() {
    const classes = {
      "usa-card__header": true,
      "usa-card__header--exdent": this.exdent || this.header.hasAttribute("exdent")
    }

    return html`
      <div class="${classMap(classes)}">
          ${this.headerContent}
      </div>
    `;
  }

  // Render media
  mediaTemplate() {
    if(!this.media) {
      return;
    }

    const classes = {
      "usa-card__media": true,
      "usa-card__media--inset": this.media.hasAttribute("inset") && !this.media.hasAttribute("exdent"),
      "usa-card__media--exdent": this.exdent || this.media.hasAttribute("exdent") && !this.media.hasAttribute("indent"),
    }

    return html`
    <div class="${classMap(classes)}">
      <div class="usa-card__img">
        ${this.media}
      </div>
    </div>
    `
  }

  // Render body
  bodyTemplate() {
    const classes = {
      "usa-card__body": true,
      "usa-card__body--exdent": this.exdent || this.body.hasAttribute("exdent")
    };

    return html`<div class="${classMap(classes)}">${this.bodyContent}</div>`
  }

  // Render footer
  footerTemplate() {
    const classes = {
      "usa-card__footer": true,
      "usa-card__footer--exdent": this.exdent || this.footer.hasAttribute("exdent")
    }

    return html`<div class="${classMap(classes)}">${this.footerContent}</div>`
  }

  // Render card
  cardTemplate() {
    const classes = {
      "usa-card": true,
      "usa-card--header-first": this.headerFirst,
      "usa-card--flag": this.layout === "flag" || this.layout === "flag-alt",
      "usa-card--media-right": this.layout == "flag-alt",
    }
    return html`
        <div class="${classMap(classes)}">
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
