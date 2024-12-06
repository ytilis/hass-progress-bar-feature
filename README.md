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
| entityId | string |  | Entity id of a sensor that goes from 0 - 100
| attribute | string |  | Attribute of the tile entity that goes from 0 - 100
| inverse | boolean | false | Show the inverse percentage (ie, 85% -> 15%)
| size | string | 3px | CSS value for progress bar height
| color | string | --primary-color | Progress bar color. Can be any valid CSS class, a HASS [CSS color variable](#css-color-variables), or the keyword `meter` which will change color based on progress on a gradient from 0 = red to 100 = green
<!-- | template | integer |  | Template string which evaluates to an integer from 0 - 100 -->
<!-- | position | string | bottom | Progress bar position, only accepts `top` or `bottom` -->
<!-- | time | [time object](#time-object-options) | | Time to derive progress from

### Time object

| Name | Type | Default | Description |
|------|:----:|:-------:|-------------|
| initial | string |  | Value or entity id of a sensor that outputs an initial time, MUST be used in conjunction with `remaining` or `duration`
| remaining | string |  | Value or entity id of a sensor that outputs a remaining time, MUST be used in conjunction with `initial` or `duration`
| start | string |  | Value or entity id of a sensor that outputs a start time, MUST be used in conjunction with `end` or `duration`
| end | string |  | Value or entity id of a sensor that outputs an end time, MUST be used in conjunction with `start` or `duration`
| duration | string |  | Value or entity id of a sensor that outputs a duration, MUST be used in conjunction with one of the other time values
-->
### CSS Color Variables
You can pass a CSS color variable to the color option so long as you prefix it with `--`

There are a number of CSS color variables available in Home Assistant out of the box, such as:
- `--primary-color`
- `--warning-color`
- `--error-color`

Your Home Assistant theme may also provide additional CSS variables.

## Examples

#### Battery Meter:
```
type: tile
entity: binary_sensor.kitchen_sink_leak
features:
  - type: custom:progress-bar-card-feature
    entityId: sensor.kitchen_sink_leak_battery_level
    color: meter
```

#### Cover Position:
```
type: tile
entity: cover.bedroom_window
features:
  - type: cover-open-close
  - type: custom:progress-bar-feature
    attribute: current_position
    inverse: true
```
<!--
#### Machine Cycle Progress
```
type: tile
entity: sensor.washer
name: Washer
progress:
  time:
    initial: {{ state_attr('sensor.washer', 'initial_time') }}
    remaining: {{ state_attr('sensor.washer', 'remain_time') }}
```
-->

## TODO

- Template value support
- Time value support
- Visual editor
- Progress bar positioning (top, bottom, left, right, around the card border)