import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class ProgressBarFeature extends LitElement {
  static DEFAULT_CONFIG = {
    size: "3px",
    color: "--primary-color",
  }

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

    this.config = Object.assign({}, ProgressBarFeature.DEFAULT_CONFIG, config);
  }

  resolveColor(color, progress) {
    if (color === 'meter') {
      // We multiply by 1.2 to make the green a little more vibrant at 100%
      color = `hsl(calc(${progress} * 1.2), 100%, 40%)`;
    
    } else if (color.startsWith('--')) {
      color = `var(${color})`;
    }

    return color;
  }

  resolveTemplate(template) {
    return template;
  }

  resolveStateValue(progress) {
    if (isNaN(progress)) {
      ProgressBarFeature.warn('State value is not a number');
      return 0;
    }
    
    return Math.round(progress);
  }

  resolveTimeProgress(time) {
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

  resolveProgress(config, stateObj, states) {
    const {
      entityId,
      attribute,
      template,
      inverse,
      time,
    } = config;

    let progress = 0;

    if (template) {
      progress = this.resolveTemplate(template);

    } else if (attribute) {
      progress = this.resolveStateValue(stateObj?.attributes[attribute]);
    
    } else if (entityId) {
      progress = this.resolveStateValue(states?.[entityId]?.state);
    
    } else if (time) {
      progress = this.resolveTimeProgress(time);
    
    } else {
      // ProgressBarFeature.error('Must pass entityId, attribute, time, or template');
      ProgressBarFeature.error('Must pass entityId or attribute');
    }

    return inverse ? 100 - progress : progress;
  }

  getPosition() {
    let style = '';
    switch (this.config.position) {
      case "top":
        style = css`top: 0;`;
        break;
      case "bottom":
        style = css`bottom: 0;`;
        break;
    }
    return style;
  }

  render() {
    if (
      !this.config ||
      !this.hass ||
      !this.stateObj
    ) {
      return null;
    }

    console.log(this.stateObj);

    const progress = this.resolveProgress(this.config, this.stateObj, this.hass?.states);
    const color = this.resolveColor(this.config.color, progress);

    return html`
      <div class="progress-bar" style="
        background-color: ${color};
        width: ${progress}%;
        height: ${this.config.size};
      "></div>
    `;
  }

  static get styles() {
    return css``;
  }
}

customElements.define("progress-bar-feature", ProgressBarFeature);

window.customCardFeatures = window.customCardFeatures || [];
window.customCardFeatures.push({
  type: "progress-bar-feature",
  name: "Progress bar",
  configurable: true,
});
