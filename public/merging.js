/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let model;
let view;
let controller;
// eslint-disable-next-line func-names

window.onload = function () {
  // eslint-disable-next-line no-undef
  model = new ModelCalendar();
  // model.handleClientLoad();
  view = new ViewCalendar(model);
  controller = new ControllerCalendar(model, view);
};
