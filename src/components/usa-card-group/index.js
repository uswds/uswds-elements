import { LitElement, html, unsafeCSS } from "lit";
import usaCardStyle from "@uswds/uswds/scss/usa-card?inline";

export class UsaCardGroup extends LitElement {
  static styles = [
    unsafeCSS(usaCardStyle),
  ]

  constructor() {
    super();

    this.cards = [...this.children];
  }

  render() {
    return html`
      <ul class="usa-card-group">
          ${this.cards.map((card) => html`<li>${card}</li>`)}
      </ul>
    `
  }
}

window.customElements.define("usa-card-group", UsaCardGroup);
