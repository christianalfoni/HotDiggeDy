var Observable = require('rxjs').Observable;
var Subject = require('rxjs').Subject;
var Immutable = require('immutable');
var view = require('./view');

function Lib(initialState, signals) {

  var state = Immutable.fromJS(initialState || {});
  var getState = function (path) {
    return state.get(path);
  };

  var wiring = Object.keys(signals).reduce(function (wiring, key) {
    var observable = new Subject();
    wiring.signals[key] = function () {observable.next.apply(observable, arguments)};
    wiring.stateChanges = wiring.stateChanges.concat(
      signals[key](observable, getState)
    );
    return wiring;
  }, {
    signals: {},
    stateChanges: []
  });

  var app = {
    signals: wiring.signals,
    initialState: state,
    state: Observable.merge.apply(Observable, wiring.stateChanges)
      .scan(function (state, change) {
        return change(state)
      }, state)
  };

  app.render = view.render.bind(null, app);

  return app;
};

Lib.DOM = view.DOM;
Lib.Component = view.Component;
Lib.render = view.render;

module.exports = Lib;
