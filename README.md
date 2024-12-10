# HASS Progress Bar Feature

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
[![GH-release](https://img.shields.io/github/v/release/ytilis/hass-progress-bar-feature.svg?style=flat-square)](https://github.com/ytilis/hass-progress-bar-feature/releases)
[![GH-downloads](https://img.shields.io/github/downloads/ytilis/hass-progress-bar-feature/total?style=flat-square)](https://github.com/ytilis/hass-progress-bar-feature/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/ytilis/hass-progress-bar-feature.svg?style=flat-square)](https://github.com/ytilis/hass-progress-bar-feature/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/ytilis/hass-progress-bar-feature.svg?color=red&style=flat-square)](https://github.com/ytilis/hass-progress-bar-feature)

--- 

A HACS integration which adds a feature to display a simple progress bar with custom colors. Can be added to any component that supports features.

## Installation

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=ytilis&repository=hass-progress-bar-feature&category=plugin" target="_blank" rel="noreferrer noopener"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open a repository inside the Home Assistant Community Store." /></a>

## Options

### Card Options

| Name | Type | Default | Description |
|------|:----:|:-------:|-------------|
| entity | string |  | Entity id of a sensor that goes from 0 - 100
| attribute | string |  | Attribute of the tile entity that goes from 0 - 100
| time | [time object](#time-object-options) | | Time to derive progress from
| inverse | boolean | `false` | Show the inverse percentage (ie, 85% -> 15%)
| position | string | bottom | Progress bar position, only accepts `top` or `bottom`
| size | string | `--feature-height` or `3px` if position is specified | CSS value for progress bar height
| color | string | `--primary-color` | Progress bar color. Can be any valid CSS value, a HASS [CSS color variable](#css-color-variables), or the keyword `meter` which will change color based on progress on a gradient from 0 = red to 100 = green
| background | string | 20% opacity variant of `color` value | Progress bar background color. Can be any valid CSS value, a HASS [CSS color variable](#css-color-variables)
<!-- | template | integer |  | Template string which evaluates to an integer from 0 - 100 -->

### Time object

| Name | Type | Default | Description |
|------|:----:|:-------:|-------------|
| initial | string |  | Attribute or entity id of a sensor that outputs an initial time, MUST be used in conjunction with `remaining` or `duration`
| remaining | string |  | Attribute or entity id of a sensor that outputs a remaining time, MUST be used in conjunction with `initial` or `duration`
| start | string |  | Attribute or entity id of a sensor that outputs a start time, MUST be used in conjunction with `end` or `duration`
| end | string |  | Attribute or entity id of a sensor that outputs an end time, MUST be used in conjunction with `start` or `duration`
<!-- | duration | string |  | Attribute or entity id of a sensor that outputs a duration, MUST be used in conjunction with one of the other time values -->

### CSS Color Variables
You can pass a CSS color variable to the color option so long as you prefix it with `--`

There are a number of CSS color variables available in Home Assistant out of the box, such as:
- `--primary-color`
- `--warning-color`
- `--error-color`

Your Home Assistant theme may also provide additional CSS variables.

## Examples

#### Battery meter anchored to bottom edge:
<img width="230" alt="image" src="https://github.com/user-attachments/assets/b65ac5cd-f0b8-4e67-be54-7b29f7e2a1f8">

```
type: tile
entity: binary_sensor.kitchen_sink_leak
features:
  - type: custom:progress-bar-feature
    entity: sensor.kitchen_sink_leak_battery_level
    color: meter
    position: bottom
```
#### Battery meter anchored to top edge with no background color:
<img width="230" alt="image" src="https://github.com/user-attachments/assets/df9dbfdc-dcf9-4084-88da-b95a2b4c75dd">

```
type: tile
entity: binary_sensor.kitchen_sink_leak
features:
  - type: custom:progress-bar-feature
    entity: sensor.kitchen_sink_leak_battery_level
    color: meter
    background: none
    position: top
```

#### Semi-transparent custom background color from a variable, different from the color value:
<img width="230" alt="image" src="https://github.com/user-attachments/assets/4a8f0ab8-9a70-476d-a783-68a0cce3ffd0">

```
type: tile
entity: binary_sensor.closet_motion
features:
  - type: custom:progress-bar-feature
    entity: sensor.closet_motion_battery_level
    color: --error-color
    background: hsla(from var(--warning-color) h s l / .2)
```

#### Cover position from attribute:
<img width="230" alt="image" src="https://github.com/user-attachments/assets/ead33c02-ac16-4a2b-ac28-9dee5548ea09">

```
type: tile
entity: cover.bedroom_window
features:
  - type: cover-open-close
  - type: custom:progress-bar-feature
    attribute: current_position
    inverse: true
```

#### Time based machine cycle progress
<img width="230" alt="image" src="https://github.com/user-attachments/assets/f0eb188c-d95b-4f91-8cb1-b86c375473f9">

```
type: tile
entity: sensor.dryer
features:
  - type: custom:progress-bar-feature
    position: bottom
    time:
      initial: initial_time
      remaining: remain_time
```
OR
```
type: tile
entity: sensor.dryer
features:
  - type: custom:progress-bar-feature
    position: bottom
    time:
      start: start_time
      end: end_time
```

## TODO

- [ ] Template value support
- [ ] Visual editor
- [ ] More progress bar positioning (left, right, around the card border)
- [x] Time value support
