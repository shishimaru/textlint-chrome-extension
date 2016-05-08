/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import { translate } from "@io-monad/chrome-util";

function translateLabel(title) {
  const key = _.camelCase(`label-${title}`).replace(/\W+/g, "");
  if (/^label\w+$/.test(key)) {
    return translate(key) || title;
  } else {
    return title;
  }
}

function fixOne(schema) {
  if (schema.title) {
    schema.title = translateLabel(schema.title);
  }
  if (schema.enum && schema.type === "string" && !_.has(schema, "options.enum_titles")) {
    const titles = _.map(schema.enum, s => s || translateLabel("NotSelected"));
    _.set(schema, "options.enum_titles", titles);
  }
  if (schema.type === "boolean" && !schema.format) {
    schema.format = "checkbox";
  }
  if ((schema.type === "integer" || schema.type === "number") && !schema.format) {
    schema.format = schema.type;
  }
}

function walk(schema) {
  fixOne(schema);
  if (schema.type === "array" && _.isObject(schema.items)) {
    walk(schema.items);
  }
  if (schema.type === "array" && _.isArray(schema.items)) {
    _.each(schema.items, walk);
  }
  if (schema.type === "array" && _.isObject(schema.additionalItems)) {
    walk(schema.additionalItems);
  }
  if (schema.type === "object" && _.isObject(schema.properties)) {
    _.each(schema.properties, walk);
  }
  if (schema.type === "object" && _.isObject(schema.additionalProperties)) {
    walk(schema.additionalProperties);
  }
  if (schema.type === "object" && _.isObject(schema.patternProperties)) {
    _.each(schema.patternProperties, walk);
  }
  if (_.isArray(schema.allOf)) {
    _.each(schema.allOf, walk);
  }
  if (_.isArray(schema.anyOf)) {
    _.each(schema.anyOf, walk);
  }
  if (_.isArray(schema.oneOf)) {
    _.each(schema.oneOf, walk);
  }
  if (_.isObject(schema.not)) {
    walk(schema.not);
  }
  return schema;
}

export default function fixSchema(root) {
  root = _.clone(root);

  // Strip root oneOf for enability since it is switched by a toggle.
  if (root.oneOf && root.oneOf.length === 2 && root.oneOf[0].type === "boolean") {
    root = root.oneOf[1];
  }
  // Return constant schema of `true` if there is only enability setting.
  if (root.type === "boolean") {
    return { type: "boolean", enum: [true] };
  }

  if (root.type === "object" && root.properties) {
    // Strip severity property since it is switched by selector.
    if (root.properties.severity) {
      delete root.properties.severity;
      if (_.isEmpty(root.properties)) {
        // There was only severity property.
        return { type: "boolean", enum: [true] };
      }
    }
    // Replace "." (dot) in property name to full-width.
    if (_.some(root.properties, (v, k) => /\./.test(k))) {
      root.properties = _.reduce(
        _.keys(root.properties).sort(),
        (accum, key, index) => {
          // Replace dots to full-width in property keys because json-editor can't handle them
          const newKey = key.replace(/\./g, "．");
          // Add propertyOrder to sort properties by key
          accum[newKey] = _.extend({ propertyOrder: index }, root.properties[key]);
          return accum;
        },
        {}
      );
    }
  }

  return walk(root);
}
