import ModalFunctionality from 'discourse/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  pollName: "",
  pollType: I18n.t("poll_ui.poll_type.regular"),
  pollMinValue: 1,
  pollMaxValue: 1,
  pollStepValue: 1,
  pollTypes: [
    { 'title': I18n.t("poll_ui.poll_type.regular") },
    { 'title': I18n.t("poll_ui.poll_type.multiple") },
    { 'title': I18n.t("poll_ui.poll_type.number") }
  ],
  pollOptions: [{id: 1, text: ""}, {id: 2, text: ""}, {id: 3, text: ""}, {id: 4, text: ""}],

  isNumberPoll: function() {
    return this.get("pollType") == I18n.t("poll_ui.poll_type.number");
  }.property("pollType"),

  isMultipleOrNumberPoll: function() {
    return this.get("pollType") == I18n.t("poll_ui.poll_type.multiple")
        || this.get("pollType") == I18n.t("poll_ui.poll_type.number");
  }.property("pollType"),

  actions: {
    apply: function() {
      this.send('closeModal');
    }
  },

  refresh: function() {
  },

  onShow: function() {
    this.setProperties({pollName: "", pollType: I18n.t("poll_ui.poll_type.regular"), pollMinValue: 1,
      pollMaxValue: 1, pollStepValue: 1,
      pollOptions: [{id: 1, text: ""}, {id: 2, text: ""}, {id: 3, text: ""}, {id: 4, text: ""}] });
  },

  init: function () {
    this._super();

    this.addObserver("pollType", function() {
      this.refresh();
    }.bind(this));
  }
});