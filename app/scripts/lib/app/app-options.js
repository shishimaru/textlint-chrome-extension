"use strict";

import _ from "lodash";

const DEFAULT_OPTIONS = {
  showMarks: true,
  showBorder: true,
  badgeCountSeverity: "error,warning,info",
  ruleOptions: {},
};

const CONTENT_OPTIONS = [
  "showMarks",
  "showBorder",
];

const VISUAL_OPTIONS = [
  "showMarks",
  "showBorder",
  "badgeCountSeverity",
];
const VISUAL_OPTIONS_SCHEMA = {
  "type": "object",
  "required": [
    "showMarks",
    "showBorder",
    "badgeCountSeverity",
  ],
  "properties": {
    "showMarks": {
      "title": "Show markers of hint messages in text area",
      "type": "boolean",
      "default": true,
    },
    "showBorder": {
      "title": "Highlight border of text area",
      "type": "boolean",
      "default": true,
    },
    "badgeCountSeverity": {
      "title": "Show count of messages on the badge",
      "type": "string",
      "enum": [
        "error",
        "error,warning",
        "error,warning,info",
        "none",
      ],
      "default": "error,warning,info",
      "options": {
        "enum_titles": [
          chrome.i18n.getMessage("labelErrors"),
          chrome.i18n.getMessage("labelErrorsAndWarnings"),
          chrome.i18n.getMessage("labelEverything"),
          chrome.i18n.getMessage("labelNone")
        ]
      }
    },
  },
};

export default class AppOptions {
  constructor(options) {
    this.options = _.defaultsDeep(options, DEFAULT_OPTIONS);
  }

  get(keys) {
    if (_.isArray(keys)) {
      return _.pick(this.options, keys);
    } else {
      return this.options[keys];
    }
  }
  set(options) {
    _.defaultsDeep(options, this.options);
  }
  overwrite(options) {
    this.options = _.defaultsDeep(options, DEFAULT_OPTIONS);
  }
  valueOf() {
    return this.options;
  }
  toObject() {
    return this.options;
  }

  get contentOptions() {
    return _.pick(this.options, CONTENT_OPTIONS);
  }

  get visualOptionsSchema() {
    return VISUAL_OPTIONS_SCHEMA;
  }
  get visualOptions() {
    return _.pick(this.options, VISUAL_OPTIONS);
  }
  set visualOptions(v) {
    v = _.pick(v || {}, VISUAL_OPTIONS);
    _.extend(this.options, v);
  }

  get showMarks() {
    return this.options.showMarks;
  }
  set showMarks(v) {
    this.options.showMarks = v;
  }
  get showBorder() {
    return this.options.showBorder;
  }
  set showBorder(V) {
    this.options.showBorder = v;
  }
  get badgeCountSeverity() {
    const val = this.options.badgeCountSeverity;
    if (val === "none") return [];
    return _.isString(val) ? val.split(",") : _.castArray(val);
  }
  set badgeCountSeverity(v) {
    if (_.isArray(v) && v.length === 0) v = "none";
    this.options.badgeCountSeverity = _.isArray(v) ? v.join(',') : v;
  }
  get ruleOptions() {
    return this.options.ruleOptions;
  }
  set ruleOptions(v) {
    this.options.ruleOptions = v;
  }
}