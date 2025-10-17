import "./index.ts";
import { html, nothing } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Alert",
  component: "usa-alert",
  tags: ["beta"],
  render: ({ heading, type, content, noIcon }) => {
    return html`
      <usa-alert type="${type}" ?no-icon="${noIcon}">
        ${heading ? html`<h3 slot="heading">${heading}</h3>` : nothing}
        <p slot="content" .innerHTML=${content}></p>
      </usa-alert>
    `;
  },
};

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const InformationalAlert = {
  args: {
    heading: "Informational Alert",
    type: "info",
    content: `Lorem ipsum dolor sit amet, <a href="#">consectetur adipiscing elit</a>, sed do eiusmod.`,
  },
};

export const WarningAlert = {
  args: {
    heading: "Warning Alert",
    type: "warning",
    content: `Lorem ipsum dolor sit amet, <a href="#">consectetur adipiscing elit</a>, sed do eiusmod.`,
  },
};

export const SuccessAlert = {
  args: {
    heading: "Success Alert",
    type: "success",
    content: `Lorem ipsum dolor sit amet, <a href="#">consectetur adipiscing elit</a>, sed do eiusmod.`,
  },
};

export const ErrorAlert = {
  args: {
    heading: "Error Alert",
    type: "error",
    content: `Lorem ipsum dolor sit amet, <a href="#">consectetur adipiscing elit</a>, sed do eiusmod.`,
  },
};

export const SlimAlert = {
  args: {
    type: "info",
    content: `Lorem ipsum dolor sit amet, <a href="#">consectetur adipiscing elit</a>, sed do eiusmod.`,
  },
};

export const AlertWithNoIcon = {
  args: {
    type: "info",
    content: `Lorem ipsum dolor sit amet, <a href="#">consectetur adipiscing elit</a>, sed do eiusmod.`,
    noIcon: "true",
  },
};
