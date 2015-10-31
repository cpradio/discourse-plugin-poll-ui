import ModalFunctionality from 'discourse/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  pollName: "",
  pollType: "regular",
  pollMinValue: 1,
  pollMaxValue: 1,
  pollStepValue: 1,
  pollTypes: [
    { 'title': I18n.t("poll_ui.poll_type.regular"), 'value': "regular" },
    { 'title': I18n.t("poll_ui.poll_type.multiple"), 'value': "multiple" },
    { 'title': I18n.t("poll_ui.poll_type.number"), 'value': "number" }
  ],
  pollOptions: "",

  isNumberPoll: function() {
    return this.get("pollType") == "number";
  }.property("pollType"),

  isMultipleOrNumberPoll: function() {
    return this.get("pollType") == "multiple"
        || this.get("pollType") == "number";
  }.property("pollType"),

  actions: {
    apply: function() {
      var name = this.get("pollName"), type = this.get("pollType"),
        minValue = this.get("pollMinValue"), maxValue = this.get("pollMaxValue"),
        stepValue = this.get("pollStepValue"), options = this.get("pollOptions"),
        self = this, composerOutput = "";

      composerOutput += "[poll";
      composerOutput += (name) ? " name='" + name + "'" : "";
      composerOutput += (type && type != "regular") ? " type=" + type : "";
      composerOutput += (minValue) ? " min=" + minValue : "";
      composerOutput += (maxValue) ? " max=" + maxValue : "";
      composerOutput += (stepValue && type == "number") ? " step=" + stepValue : "";
      composerOutput += "]\r\n" + options.replace(/^(.*)/gmi, "* $1") + "\r\n[/poll]";
      self.composerView.addMarkdown(composerOutput);
      this.send('closeModal');
    }
  },

  refresh: function() {
  },

  onShow: function() {
    this.setProperties({pollName: "", pollType: "regular", pollMinValue: 1,
      pollMaxValue: 1, pollStepValue: 1, pollOptions: "" });
  },

  init: function () {
    this._super();

    this.addObserver("pollType", function() {
      this.refresh();
    }.bind(this));
  }
});