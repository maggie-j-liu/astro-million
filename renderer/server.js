import React from "million/react";
import * as ReactDOM from "million/react/server";
import StaticHtml from "./static-html.js";

const slotName = (str) =>
  str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());

function check(Component, props, children) {
  return props.million;
}

const replaceClassNameWithClass = (node) => {
  if (node.props?.className) {
    node.props.class = node.props.className;
    delete node.props.className;
  }
  if (node.children) {
    for (const child of node.children) {
      replaceClassNameWithClass(child);
    }
  }
  return node;
};

function renderToStaticMarkup(
  Component,
  props,
  { default: children, ...slotted },
  metadata
) {
  delete props["class"];
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = React.createElement(StaticHtml, { value, name });
  }
  // Note: create newProps to avoid mutating `props` before they are serialized
  const newProps = {
    ...props,
    ...slots,
    children:
      children != null
        ? React.createElement(StaticHtml, { value: children })
        : undefined,
  };
  const vnode = replaceClassNameWithClass(
    React.createElement(Component, newProps)
  );
  let html;
  if (metadata && metadata.hydrate) {
    html = ReactDOM.renderToString(vnode);
  } else {
    html = ReactDOM.renderToStaticMarkup(vnode);
  }
  return { html };
}

export default {
  check,
  renderToStaticMarkup,
};
