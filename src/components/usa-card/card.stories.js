import "./index";
import "../usa-card-group/index";

import { html, nothing } from "lit";

export default {
  title: "Components/Card",
  component: "usa-card",
  args: {
    title: "",
    media: "https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo cupiditate, eaque qui officia recusandae.",
    buttonText: "Visit Florida Keys",
    headerFirst: false,
    layout: "default"
  },
  argTypes: {
    buttonText: {
      description: "Card button text."
    },
    content: {
      description: "Card body content."
    },
    headerFirst: {
      description: "Place the header above above card media."
    },
    media: {
      description: "Img src for component preview."
    },
    layout: {
      control: { type: 'radio' },
      options: ['default', 'flag', 'flag-alt'],
      description: "Media card layout at wide widths."
    },
    title: {
      description: "Card header text."
    }
  },
  render: ({ title, content, buttonText }) => {
    return html`
      <usa-card>
        <div slot="card-header">
          <h2 part="card-heading">${title || "Card"}</h2>
        </div> 
          <p>
            ${content}
          </p>
        </div>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const Default = {
  argTypes: {
    media: {
      table: {
        disable: true
      }
    },
    headerFirst: {
      table: {
        disable: true
      }
    },
    layout: {
      table: {
        disable: true
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A default card with a title, text content, and a button.'
      }
    }
  }
};

export const CardWithMedia = {
  argTypes: {
    headerFirst: {
      table: {
        disable: true
      }
    },
    layout: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A card variant featuring media.'
      }
    }
  },
  render: ({ title, media, content, buttonText, headerFirst }) => {
    return html`
      <usa-card ?header-first=${headerFirst}>
        <img slot="card-media" src="${media}" alt="Placeholder image">
        <div slot="card-header">
          <h2 part="card-heading">${title || "Card w/ Media"}</h2>
        </div>
        <p>
          ${content}
        </p>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const MediaWithHeaderFirst = {
  args: {
    headerFirst: true
  },
  argTypes: {
    layout: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A card variant featuring media, displaying the header first.'
      }
    }
  },
  render: ({ title, media, content, buttonText, headerFirst }) => {
    return html`
      <usa-card ?header-first=${headerFirst}>
        <img slot="card-media" src="${media}" alt="Placeholder image">
        <div slot="card-header">
          <h2 part="card-heading">${title || "Media with Header first"}</h2>
        </div>
        <p>
          ${content}
        </p>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const InsetMedia = {
  argTypes: {
    headerFirst: {
      table: {
        disable: true
      }
    },
    layout: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Indents the media element so it doesn’t extend to the edge of the card.'
      }
    }
  },
  render: ({ title, media, content, buttonText }) => {
    return html`
      <usa-card>
        <img slot="card-media" src="${media}" alt="Placeholder image" inset>
        <div slot="card-header">
          <h2 part="card-heading">${title || "Inset Media"}</h2>
        </div>
        <p>
          ${content}
        </p>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const ExdentMedia = {
  argTypes: {
    headerFirst: {
      table: {
        disable: true
      }
    },
    layout: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Extends the media element out over the card border.'
      }
    }
  },
  render: ({ title, media, content, buttonText }) => {
    return html`
      <usa-card>
        <img slot="card-media" src="${media}" alt="Placeholder image" exdent>
        <div slot="card-header">
          <h2 part="card-heading">${title || "Exdent media"}</h2>
        </div>
        <p>
          ${content}
        </p>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const FullExdent = {
  argTypes: {
    headerFirst: {
      table: {
        disable: true
      }
    },
    layout: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Extends the media element out over the card border.'
      }
    }
  },
  render: ({ title, media, content, buttonText }) => {
    return html`
      <usa-card exdent>
        <img slot="card-media" src="${media}" alt="Placeholder image">
        <div slot="card-header">
          <h2 part="card-heading">${title || "Exdent media"}</h2>
        </div>
        <p>
          ${content}
        </p>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const Flag = {
  args: {
    layout: "flag",
  },
  parameters: {
    docs: {
      description: {
        story: 'Display in a horizontal (“flag”) orientation at a specified width ($theme-card-flag-min-width).'
      }
    }
  },
  render: ({ title, media, content, buttonText, headerFirst, layout }) => {
    return html`
      <usa-card ?header-first=${headerFirst} layout="${layout == 'default' ? nothing : layout}">
        <img slot="card-media" src="${media}" alt="Placeholder image"  class="usa-card__image">
        <div slot="card-header">
          <h2 class="card-heading">${title || "Default flag"}</h2>
        </div>
        <p>
          ${content}
        </p>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const FlagMediaRightInset = {
  args: {
    layout: "flag-alt"
  },
  parameters: {
    docs: {
      description: {
        story: 'Display in a horizontal (“flag”) orientation with media inset and on the right side.'
      }
    }
  },
  render: ({ title, media, content, buttonText, layout, headerFirst }) => {
    return html`
      <usa-card ?header-first=${headerFirst} layout="${layout == 'default' ? nothing : layout}">
        <img slot="card-media" src="${media}" alt="Placeholder image">
        <div slot="card-header">
          <h2 part="card-heading">${title || "Flag media right inset"}
          </h2>
        </div>
        <p>
          ${content}
        </p>
        </div>
        <div slot="card-footer">
          <a href="#" class="usa-button">${buttonText}</a>
        </div>
      </usa-card>
    `
  }
}

export const CardGroup = {
  argTypes: {
    headerFirst: {
      table: {
        disable: true
      }
    },
    layout: {
      table: {
        disable: true
      }
    }
  },
  render: ({ title, media, content, buttonText }) => {
    return html`
      <usa-card-group>
        <usa-card>
          <div slot="card-header">
            <h2 part="card-heading">${title || "Card"}</h2>
          </div> 
          <p>
            ${content}
          </p>
          <div slot="card-footer">
            <a href="#" class="usa-button">${buttonText}</a>
          </div>
        </usa-card>

        <usa-card>
          <img slot="card-media" src="${media}" alt="Placeholder image">
          <div slot="card-header">
            <h2 part="card-heading">${ title || "Card w/ Media"}</h2>
          </div>
          <p>
            ${content}
          </p>
          <div slot="card-footer">
            <a href="#" class="usa-button">${buttonText}</a>
          </div>
        </usa-card>

        <usa-card header-first>
          <img slot="card-media" src="${media}" alt="Placeholder image">
          <div slot="card-header">
            <h2 part="card-heading">${ title || "Media with Header first"}</h2>
          </div>
          <p>
            ${content}
          </p>
          <div slot="card-footer">
            <a href="#" class="usa-button">${buttonText}</a>
          </div>
        </usa-card>

        <usa-card>
          <img slot="card-media" src="${media}" alt="Placeholder image">
          <div slot="card-header">
            <h2 part="card-heading">${ title || "Inset Media"}</h2>
          </div>
          <p>
            ${content}
          </p>
          <div slot="card-footer">
            <a href="#" class="usa-button">${buttonText}</a>
          </div>
        </usa-card>

        <usa-card>
          <img slot="card-media" src="${media}" alt="Placeholder image" exdent>
          <div slot="card-header">
            <h2 part="card-heading">${ title || "Exdent media"}</h2>
          </div>
          <p>
            ${content}
          </p>
          <div slot="card-footer">
            <a href="#" class="usa-button">${buttonText}</a>
          </div>
        </usa-card>

        <usa-card headerFirst layout="flag">
          <img slot="card-media" src="${media}" alt="Placeholder image">
          <div slot="card-header">
            <h2 part="card-heading">${title || "Default flag"}</h2>
          </div>
          <p>
            ${content}
          </p>
          <div slot="card-footer">
            <a href="#" class="usa-button">${buttonText}</a>
          </div>
        </usa-card>

        <usa-card headerFirst layout="flag-alt">
          <img slot="card-media" src="${media}" alt="Placeholder image">
          <div slot="card-header">
            <h2 part="card-heading">${title || "Flag media right inset"}
            </h2>
          </div>
          <p>
            ${content}
          </p>
          <div slot="card-footer">
            <a href="#" class="usa-button">${buttonText}</a>
          </div>
        </usa-card>
      </usa-card-group>
    `
  },
}

  export const TestStory = {
    render: ({ media, title, content, buttonText }) => {
      return html`
        <usa-card-group>
          <usa-card>
            <div slot="card-header" part="card-header">
              <h1 part="cardheading">Header 1</h1>
              <h2>Subheading</h2>
            </div>
            <p>
              This example uses a div with the slot "card-header" to put both headings in the header section. We are unable to add styles to the nested heading elements with the custom element stylesheet because they are children of the slotted element.
            </p>
            <div slot="card-footer">
              <a href="#" class="usa-button">
                click me
              </a>
            </div>
          </usa-card>
          <usa-card>
            <h1 part="cardheading" slot="card-header" class="usa-card__heading">Header 1</h1>
            <h2 slot="card-header">Subheading</h2>
            <p>
              This example does not use a div wrapper to next both headings. Instead, it puts "slot='card-header'" on both heading elements. 
            </p>
            <p>
              Notice, we are able to add styles because they <strong>ARE</strong> the slotted element.
            </p>
            <div slot="card-footer">
              <a href="#" class="usa-button">
                click me
              </a>
            </div>
          </usa-card>
          <usa-card headerFirst layout="flag">
            <img slot="card-media" src="${media}" alt="Placeholder image">
            <div slot="card-header">
              <h2 class="test-card__heading" part="cardheading">${title || "Default flag"}</h2>
            </div>
            <p>
              ${content}
            </p>
            <div slot="card-footer">
              <a href="#" class="usa-button">${buttonText}</a>
            </div>
          </usa-card>
          <usa-card>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam neque ullam quia harum quaerat debitis, et minima fugit expedita hic?
            <button class="usa-button">
              Click me
            </button>
          </usa-card>
          <usa-card exdent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam neque ullam quia harum quaerat debitis, et minima fugit expedita hic?
            <button class="usa-button">
              Click me
            </button>
          </usa-card>
        </usa-card-group>
      `
    } 
  }
