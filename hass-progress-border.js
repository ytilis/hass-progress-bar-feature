const Name = "PROGRESS-BORDER";
const Version = "2024-11-26";
const Description = "Add a progress bar border to HASS cards";
const Url = "https://github.com/ytilis/hass-progress-border";
console.info(
  `%c  ${Name} %c v${Version} `,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);

class ProgressBorder {
  constructor() {
    this.installCardHooks();
  }

  installCardHooks() {
    // Hook into some existing card lifecycle update methods
    // TODO: Find a better way to handle this dynamically. Possibly iterating over the custom element registry
    [
      'hui-tile-card',
      'hui-entity-card',
      'mushroom-alarm-control-panel-card',
      'mushroom-climate-card',
      'mushroom-cover-card',
      'mushroom-entity-card',
      'mushroom-fan-card',
      'mushroom-humidifier-card',
      'mushroom-light-card',
      'mushroom-lock-card',
      'mushroom-media-player-card',
      'mushroom-number-card',
      'mushroom-person-card',
      'mushroom-select-card',
      'mushroom-title-card',
      'mushroom-update-card',
      'mushroom-vacuum-card',
      'mushroom-template-card',
    ].forEach(this.addCardHook);
  }

  addCardHook(cardType) {
    customElements.whenDefined(cardType).then(() => {
      const card = customElements.get(cardType);
      if (!card) return;

      if (card.prototype?.updated) {
        ProgressBorder.hijackUpdated(card, cardType);
      }
    });
  }

  static hijackUpdated(card, cardType) {
    const originalUpdated = card.prototype.updated;
    card.prototype.updated = function progressBarUpdated(changedProps) {
        if (
          !changedProps.has('_config') ||
          !changedProps.has('hass')
        ) {
          return;
        }
        const { _config, hass } = this;
        const { entity, progress } = _config;
        const { states } = hass;

        if (progress) {
          const progressBar = ProgressBorder.processProgress(progress, entity, states);
          ProgressBorder.addProgressBorder(progressBar, this, cardType);
        }

        originalUpdated.call(this, changedProps);
    }
  }

  static processProgress(progress, entityId, states) {
    const {
      entity = entityId,
      position = 'bottom',
      size = '3px',
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

      // if (time) {
      //   if (time.initial || time.remaining) {
      //     if (!time.initial || !time.remaining) {
      //       ProgressBorder.warn('time.initial & time.remaining are co-dependent');
      //       return;
      //     }
      //     const initial = new Date(time.initial);
      //     const remaining = new Date(time.remaining);
      //     const total = remaining - initial;
      //     const elapsed = new Date() - initial;
      //     percentage = Math.round((elapsed / total) * 100);
      //   }
  
      //   if (time.start || time.end) {
      //     if (!time.start || !time.end) {
      //       ProgressBorder.warn('time.start & time.end are co-dependent');
      //       return;
      //     }
      //     const start = new Date(time.start);
      //     const end = new Date(time.end);
      //     const total = end - start;
      //     const elapsed = new Date() - start;
      //     percentage = Math.round((elapsed / total) * 100);
      //   }
      // }
    }
    
    if (color === 'meter') {
      // We multiply by 1.2 to make the green a little more vibrant at 100%
      color = `hsl(calc(${percentage} * 1.2), 100%, 40%)`;
    
    } else if (color.startsWith('--')) {
      color = `var(${color})`;
    }
    
    return { percentage, color, size, position };
  }

  static addProgressBorder(progressBar, cardRef, cardType) {
    const { percentage, color, size, position } = progressBar;

    let target = cardRef.shadowRoot.querySelector('ha-card');
    target.style.overflow = 'hidden';

    const progressEle = document.createElement('div');
    
    progressEle.style.position = 'absolute';
    progressEle.style.width = `${percentage}%`;
    progressEle.style.height = size;
    progressEle.style.backgroundColor = color;
    position === 'top' ? progressEle.style.top = 0 : progressEle.style.bottom = 0;
    target.appendChild(progressEle);
  }
  
  static log(...msg) {
    console.log("ProgressBorder Debug:", ...msg);
  }

  static warn(...msg) {
    console.warn("ProgressBorder Debug:", ...msg);
  }
}

new ProgressBorder();
