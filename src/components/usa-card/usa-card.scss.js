import uswdsCoreStyle from "@uswds/uswds/scss/uswds-core?inline";
import usaCardStyle from "@uswds/uswds/scss/usa-card?inline";
import usaButtonStyle from "@uswds/uswds/scss/usa-button?inline";

import { unsafeCSS, css } from "lit";

export const cardStyles = [
  unsafeCSS(uswdsCoreStyle),
  unsafeCSS(usaCardStyle),
  unsafeCSS(usaButtonStyle),
  css`
    * {
      box-sizing: border-box;
    }

    [slot="card-heading"] {
      font-family: "Merriweather Web", Georgia, Cambria, "Times New Roman", Times, serif;
      font-size: 1.34rem;
      line-height: 1.2;
      margin: 0px;
    }
  `
]
