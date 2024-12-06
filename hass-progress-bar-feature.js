import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class ProgressBarFeature extends LitElement {
  static get properties() {
    return {
      hass: undefined,
      config: undefined,
      stateObj: undefined,
    };
  }

  static getStubConfig() {
    return {
      type: "custom:progress-bar-feature",
    };
  }

  static log = (...msg) => console.log('ProgressBarFeature:', ...msg);
  static warn = (...msg) => console.warn('ProgressBarFeature:', ...msg);
  static error = (msg, options) => { throw new Error(`ProgressBarFeature: ${msg}`, options); }

  setConfig(config) {
    if (!config) {
      ProgressBarFeature.error('Invalid configuration');
    }

    this.config = config;
  }

  static resolveCssVars(value) {
    return value.startsWith('--') ? `var(${value})` : value;
  }
  
  static resolveColor(color, progress) {
    if (color === 'meter') {
      // We multiply by 1.2 to make the green a little more vibrant at 100%
      color = `hsl(calc(${progress} * 1.2), 100%, 40%)`;
    }

    return ProgressBarFeature.resolveCssVars(color || '--primary-color');
  }

  static resolveColorBg(background) {
    return background
      ? ProgressBarFeature.resolveCssVars(background)
      : 'hsla(from var(--progress-bar-color) h s l / .2)';
  }

  static resolveSize(config) {
    const { size, position } = config;

    return ProgressBarFeature.resolveCssVars(
      size || position && '3px' || '--feature-height'
    );
  }

  static resolveTemplate(template) {
    return template;
  }

  static resolveTimeProgress(time) {
    // if (time.initial || time.remaining) {
    //   console.log(time.initial, time.remaining);
    //   if (!time.initial || !time.remaining) {
    //     ProgressBarFeature.warn('time.initial & time.remaining are co-dependent');
    //     return;
    //   }
    //   const initial = new Date(time.initial);
    //   const remaining = new Date(time.remaining);
    //   const total = remaining - initial;
    //   const elapsed = new Date() - initial;
    //   progress = Math.round((elapsed / total) * 100);
    // }

    // if (time.start || time.end) {
    //   if (!time.start || !time.end) {
    //     ProgressBarFeature.warn('time.start & time.end are co-dependent');
    //     return;
    //   }
    //   const start = new Date(time.start);
    //   const end = new Date(time.end);
    //   const total = end - start;
    //   const elapsed = new Date() - start;
    //   progress = Math.round((elapsed / total) * 100);
    // }
  }

  static resolveProgress(config, stateObj, states) {
    const {
      entity,
      attribute,
      template,
      inverse,
      time,
    } = config;

    let progress = 0;

    if (template) {
      progress = ProgressBarFeature.resolveTemplate(template);

    } else if (attribute) {
      progress = stateObj?.attributes[attribute];
    
    } else if (entity) {
      progress = states?.[entity]?.state;
    
    } else if (time) {
      progress = ProgressBarFeature.resolveTimeProgress(time);
    
    } else {
      // ProgressBarFeature.error('Must pass entity, attribute, time, or template');
      ProgressBarFeature.error('Must pass entity or attribute');
    }

    if (isNaN(progress)) {
      ProgressBarFeature.warn('Progress value must be a number, currently:', progress);
      return 0;
    }

    if (progress < 0 || progress > 100) {
      ProgressBarFeature.warn('Progress value must be a number between 0 - 100, currently:', progress);
      progress = Math.min(Math.max(progress, 0), 100);
    }

    return Math.round(inverse ? 100 - progress : progress);
  }

  static getPosition(position, size) {
    switch (position) {
      case 'top':
        return 'top: 0';
      case 'bottom':
        return 'bottom: 0';
      default:
        return '';
    }
  }

  static closestPierceShadow(node, selector) {
    if (!node) {
      return null;
    }

    if (node instanceof ShadowRoot) {
      return ProgressBarFeature.closestPierceShadow(node.host, selector);
    }

    if (node instanceof HTMLElement && node.matches(selector)) {
      return node;
    }

    return ProgressBarFeature.closestPierceShadow(node.parentNode, selector);
  }

  static fixCardStyles(node) {
    // We need to turn off the relative positioning on some parents to pull the progress bar to the edge
    const container = ProgressBarFeature.closestPierceShadow(node, '.container');
    container?.style.setProperty('position', 'static');
    const cardFeatures = ProgressBarFeature.closestPierceShadow(node, 'hui-card-features');
    cardFeatures?.style.setProperty('position', 'static');

    // And cut off the edges of the bar to match the border radius
    const card = ProgressBarFeature.closestPierceShadow(node, 'ha-card');
    card?.style.setProperty('overflow', 'hidden');

    // The default behavior is to increase the row size of the card for each feature
    // But if we're attaching the progress to the card edge, we don't want that
    // So we have to pierce through multiple layers of shadow dom to override the row size
    const cardContainer = ProgressBarFeature.closestPierceShadow(node, '.card');
    const cardContainerRowSize = getComputedStyle(cardContainer)?.getPropertyValue('--row-size');
    if (cardContainerRowSize) {
      const newRowSize = parseInt(cardContainerRowSize) - 1;
      cardContainer?.style.setProperty('--row-size', newRowSize);
    }
  }

  render() {
    if (
      !this.config ||
      !this.hass ||
      !this.stateObj
    ) {
      return null;
    }

    const progress = ProgressBarFeature.resolveProgress(this.config, this.stateObj, this.hass?.states);
    const color = ProgressBarFeature.resolveColor(this.config.color, progress);
    const colorBg = ProgressBarFeature.resolveColorBg(this.config.background);
    const size = ProgressBarFeature.resolveSize(this.config);
    const position = ProgressBarFeature.getPosition(this.config.position, size);

    if(this.config.position) {
      ProgressBarFeature.fixCardStyles(this);
    }

    return html`
      <div 
        class="
          progress-bar
          ${this.config.position ? `progress-bar-anchored` : ''}
        " 
        style="
          --progress-bar-color: ${color};
          --progress-bar-color-bg: ${colorBg};
          --progress-bar-width: ${progress}%;
          --progress-bar-size: ${size};
          ${position}
        "
      ></div>
    `;
  }

  static get styles() {
    return css`
      .progress-bar {
        position: relative;
        height: var(--progress-bar-size);
      }

      .progress-bar-anchored {
        position: absolute;
        left: 0;
        width: 100%;
      }

      .progress-bar::before,
      .progress-bar::after {
        content: '';
        position: absolute;
        width: 100%;
        height: var(--progress-bar-size);        
        border-radius: var(--feature-border-radius, 12px);
      }
      
      .progress-bar::before {
        background-color: var(--progress-bar-color-bg);
      }
      
      .progress-bar::after {
        background-color: var(--progress-bar-color);
        width: var(--progress-bar-width);
      }
    `;
  }
}

customElements.define("progress-bar-feature", ProgressBarFeature);

window.customCardFeatures = window.customCardFeatures || [];
window.customCardFeatures.push({
  type: "progress-bar-feature",
  name: "Progress bar",
  configurable: true,
});
