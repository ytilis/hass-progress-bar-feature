# HASS Progress Border

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
[![GH-release](https://img.shields.io/github/v/release/ytilis/hass-progress-border.svg?style=flat-square)](https://github.com/ytilis/hass-progress-border/releases)
[![GH-downloads](https://img.shields.io/github/downloads/ytilis/hass-progress-border/total?style=flat-square)](https://github.com/ytilis/hass-progress-border/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/ytilis/hass-progress-border.svg?style=flat-square)](https://github.com/ytilis/hass-progress-border/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/ytilis/hass-progress-border.svg?color=red&style=flat-square)](https://github.com/ytilis/hass-progress-border)

--- 

A HACS integration which adds the option to display a progress bar as a card border (top or bottom), with custom colors. Can be added to Tile or Entity cards.

## Options

### Card Options

| Name | Type | Default | Description |
|------|:----:|:-------:|-------------|
| entity | string |  | Entity id of a sensor that goes from 0 - 100
| percentage | integer |  | Set value for the percentage (useful for template values)
| size | string | 3px | CSS value for progress bar height
| position | string | bottom | Progress bar position, only accepts `top` or `bottom`
| color | string | --primary-color | Progress bar color. Can be any valid CSS class, a HASS [CSS color variable](#css-color-variables), or the keyword `meter` which will change color based on progress on a gradient from 0 = red to 100 = green
<!--| time | [time object](#time-object-options) | | Time to derive progress from

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
entity: binary_sensor.fridge_water_leak_detected
name: Fridge Leak
progress:
  entity: sensor.fridge_water_leak_battery
  color: meter
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

## Installation

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=ytilis&repository=hass-progress-border&category=plugin" target="_blank" rel="noreferrer noopener"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open a repository inside the Home Assistant Community Store." /></a>
