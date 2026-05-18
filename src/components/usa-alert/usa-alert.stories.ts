import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./index.js";

const meta: Meta = {
  title: "Components/Alert",
  component: "usa-alert",
  tags: ["autodocs", "alpha"],
  argTypes: {
    status: {
      control: "select",
      options: ["info", "warning", "error", "success", "emergency"],
    },
    slim: { control: "boolean" },
    "no-icon": { control: "boolean" },
    closeable: { control: "boolean" },
    "close-label": { control: "text" },
  },
};
export default meta;

type Story = StoryObj;

export const Info: Story = {
  render: () => html`
    <usa-alert status="info">
      <h3 slot="headline">Informative status</h3>
      <p>An alert with contextual information for the user.</p>
    </usa-alert>
  `,
};

export const Warning: Story = {
  render: () => html`
    <usa-alert status="warning">
      <h3 slot="headline">Warning status</h3>
      <p>An alert that warns the user about something important.</p>
    </usa-alert>
  `,
};

export const Error: Story = {
  render: () => html`
    <usa-alert status="error">
      <h3 slot="headline">Error status</h3>
      <p>An alert indicating an error has occurred.</p>
    </usa-alert>
  `,
};

export const Success: Story = {
  render: () => html`
    <usa-alert status="success">
      <h3 slot="headline">Success status</h3>
      <p>An alert indicating a successful action.</p>
    </usa-alert>
  `,
};

export const Emergency: Story = {
  render: () => html`
    <usa-alert status="emergency">
      <h3 slot="headline">Emergency status</h3>
      <p>An alert for emergency communications.</p>
    </usa-alert>
  `,
};

export const Slim: Story = {
  render: () => html`
    <usa-alert status="info" slim>
      <p>A slim alert without a heading.</p>
    </usa-alert>
  `,
};

export const SlimWarning: Story = {
  render: () => html`
    <usa-alert status="warning" slim>
      <p>A slim warning alert.</p>
    </usa-alert>
  `,
};

export const NoIcon: Story = {
  render: () => html`
    <usa-alert status="info" no-icon>
      <h3 slot="headline">No icon</h3>
      <p>An alert without the status icon.</p>
    </usa-alert>
  `,
};

export const Closeable: Story = {
  render: () => html`
    <usa-alert status="info" closeable>
      <h3 slot="headline">Closeable alert</h3>
      <p>This alert can be dismissed by clicking the close button.</p>
    </usa-alert>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <usa-alert status="info">
        <h3 slot="headline">Informative status</h3>
        <p>An informational alert.</p>
      </usa-alert>
      <usa-alert status="warning">
        <h3 slot="headline">Warning status</h3>
        <p>A warning alert.</p>
      </usa-alert>
      <usa-alert status="error">
        <h3 slot="headline">Error status</h3>
        <p>An error alert.</p>
      </usa-alert>
      <usa-alert status="success">
        <h3 slot="headline">Success status</h3>
        <p>A success alert.</p>
      </usa-alert>
      <usa-alert status="emergency">
        <h3 slot="headline">Emergency status</h3>
        <p>An emergency alert.</p>
      </usa-alert>
    </div>
  `,
};
