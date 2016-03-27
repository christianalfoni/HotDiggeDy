var AnimationFrameScheduler = require('rxjs/scheduler/AnimationFrameScheduler').AnimationFrameScheduler;
var snabbdom = require('snabbdom');
var html = require('snabbdom-jsx').html;

var optimized = {};

var patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/attributes'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
  {
    destroy: function(vnode) {
      if (vnode.key) {
        delete optimized[key];
      }
    }
  }
]);

var hasChanged = function (oldProps, oldState, newProps, newState) {
  if (
    Object.keys(oldProps).length !== Object.keys(newProps).length ||
    Object.keys(oldState).length !== Object.keys(newState).length
  ) {
    return true;
  }
  for (var key in oldProps) {
    if (oldProps[key] !== newProps[key]) {
      return true;
    }
  }
  for (var key in oldState) {
    if (oldState[key] !== newState[key]) {
      return true;
    }
  }
  return false;
};

var currentApp = null;
var prevState = null;
var currentState = null;

function Component(render) {
  return function (props, children) {
    props.children = children;
    var vnode = render(props, currentState.get.bind(currentState), currentApp.signals);

    return vnode;
  }
};

module.exports.DOM = html;

module.exports.Component = Component;

module.exports.render = function render(app, cb, el) {
  currentApp = app;
  currentState = app.initialState;

  var prevNode = cb();
  app.state.debounceTime(0, new AnimationFrameScheduler()).subscribe(function (state) {
    currentState = state;
    var newNode = cb();
    patch(prevNode, newNode);
    prevNode = newNode;
  });
  patch(el, prevNode);
}
