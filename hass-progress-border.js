const Name = "PROGRESS-BORDER";
const Version = "2024-11-26";
const Description = "Add a progress bar border to HASS cards";
const Url = "https://github.com/ytilis/hass-progress-border";
console.info(
  `%c  ${Name} %c v${Version} `,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);

window.customUI = {
// Install the hooks for updating states, entity cards, and state badges
  installCustomHooks() {
    window.customUI.addCardHook('hui-tile-card');
    window.customUI.addCardHook('hui-entity-card');
  },

  addCardHook(cardType) {
    customElements.whenDefined(cardType).then(() => {
      const card = customElements.get(cardType);
      if (!card) return;
      if (card.prototype?.updated) {
        const originalUpdated = card.prototype.updated;
        card.prototype.updated = function customUpdated(changedProps) {
            if (
              !changedProps.has('_config') ||
              !changedProps.has('hass')
            ) {
              return;
            }
            const { _config, hass } = this;
            const entityId = _config?.entity;
            const states = hass?.states;
            const progress = _config.progress;

            if (progress) {
              const progressBar = window.customUI.processProgress(progress, entityId, states);
              window.customUI.addProgressBorder(progressBar, cardType, this);
            }

            originalUpdated.call(this, changedProps);
        }
      }
  });
  },

  processProgress(progress, entityId, states) {
    const {
      entity = entityId,
      height = '3px',
      position = 'bottom',
      time,
    } = progress;
    
    let {
      color = '--primary-color',
      percentage,
    } = progress;

    // Calculate percentages if one isn't explicitly passed
    if (!percentage) {
      if (entity) {
        percentage = states?.[entity]?.state;
        if (!isNaN(percentage)) {
          percentage = Math.round(percentage);
        }
      }

      if (time) {
        if (time.initial || time.remaining) {
          if (!time.initial || !time.remaining) {
            window.customUI.warn('time.initial & time.remaining are co-dependent');
            return;
          }
          const initial = new Date(time.initial);
          const remaining = new Date(time.remaining);
          const total = remaining - initial;
          const elapsed = new Date() - initial;
          percentage = Math.round((elapsed / total) * 100);
        }
  
        if (time.start || time.end) {
          if (!time.start || !time.end) {
            window.customUI.warn('time.start & time.end are co-dependent');
            return;
          }
          const start = new Date(time.start);
          const end = new Date(time.end);
          const total = end - start;
          const elapsed = new Date() - start;
          percentage = Math.round((elapsed / total) * 100);
        }
      }
    }
    
    if (color === 'meter') {
      color = `hsl(${percentage}, 100%, 40%)`;
      // color = `hsl(calc(${percentage} * 1.3), 100%, 40%)`;
    
    } else if (color.startsWith('--')) {
      color = `var(${color})`;
    }
    
    return { percentage, color, height, position };
  },

  addProgressBorder(progressBar, cardType, card) {
    const { percentage, color, height, position } = progressBar;
    let target;

    switch (cardType) {
      case 'hui-entity-card':
        target = card.shadowRoot.querySelector('ha-card .footer');
        break;
      case 'hui-tile-card':
        target = card.shadowRoot.querySelector('ha-card .background');
        break;
      default:
        target = card.shadowRoot.querySelector('ha-card');
    };

    const progressEle = document.createElement('div');
    
    progressEle.style.position = 'absolute';
    progressEle.style.width = `${percentage}%`;
    progressEle.style.height = height;
    progressEle.style.backgroundColor = color;
    position === 'top' ? progressEle.style.top = 0 : progressEle.style.bottom = 0;
    target.appendChild(progressEle);
  },
  
  log(...msg) {
    console.log("ProgressBorder Debug:", ...msg);
  },

  warn(...msg) {
    console.warn("ProgressBorder Debug:", ...msg);
  },
  

  init() {
    window.customUI.initDone = true;
    window.customUI.installCustomHooks();
    window.CUSTOM_UI_LIST = window.CUSTOM_UI_LIST || [];
    window.CUSTOM_UI_LIST.push({
      name: Name,
      version: `${Version} ${Description}`,
      url: Url
    });
  },

};
window.customUI.init();
