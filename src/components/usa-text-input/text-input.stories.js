import "./index";

import { html } from "lit";

export default {
  title: "Components/Text input",
  component: "usa-text-input",
  render: () => html`
    <usa-text-input>
      <label for="input-type-text">Text input label</label>
      <input id="input-type-text" name="input-type-text" />
    </usa-text-input>
  `,
};

export const Default = {};
