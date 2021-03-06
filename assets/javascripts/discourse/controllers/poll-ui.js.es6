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
  pollAnswerValue: "",
  pollMakePublic: false,
  choicesClass: Discourse.SiteSettings.poll_ui_provide_answers ? "has-answers" : "no-answers",
  canProvideAnswers: Discourse.SiteSettings.poll_ui_provide_answers,

  isNumberPoll: function() {
    return this.get("pollType") === "number";
  }.property("pollType"),

  isMultipleOrNumberPoll: function() {
    return this.get("pollType") === "multiple"
        || this.get("pollType") === "number";
  }.property("pollType"),

  // Validate the Minimum Value.
  minValueValidation: function() {
    var mustBeNumeric = new RegExp(/^[\d]+$/),
      minValue = this.get('pollMinValue'),
      intMinValue = parseInt(this.get('pollMinValue')),
      intMaxValue = parseInt(this.get('pollMaxValue'));
    if (Ember.isEmpty(minValue) || !parseInt(minValue) || !mustBeNumeric.test(minValue)) {
      return Discourse.InputValidation.create({ failed: true, reason: I18n.t("poll_ui.poll_min_must_be_numeric") });
    }

    if (intMinValue > intMaxValue) {
      return Discourse.InputValidation.create({ failed: true, reason: I18n.t("poll_ui.poll_min_must_be_less_than_max") });
    }

    return Discourse.InputValidation.create({ok: true});
  }.property('pollMinValue', 'pollMaxValue'),

  // Validate the Maximum Value.
  maxValueValidation: function() {
    var mustBeNumeric = new RegExp(/^[\d]+$/),
      maxValue = this.get('pollMaxValue');
    if (Ember.isEmpty(maxValue) || !parseInt(maxValue) || !mustBeNumeric.test(maxValue)) {
      return Discourse.InputValidation.create({ failed: true, reason: I18n.t("poll_ui.poll_max_must_be_numeric") });
    }

    return Discourse.InputValidation.create({ok: true});
  }.property('pollMaxValue'),

  // Validate the Step Value.
  stepValueValidation: function() {
    var mustBeNumeric = new RegExp(/^[\d]+$/),
      stepValue = this.get('pollStepValue'),
      intStepValue = parseInt(this.get('pollStepValue')),
      intMaxValue = parseInt(this.get('pollMaxValue'));
    if (Ember.isEmpty(stepValue) || !parseInt(stepValue) || !mustBeNumeric.test(stepValue)) {
      return Discourse.InputValidation.create({ failed: true, reason: I18n.t("poll_ui.poll_step_must_be_numeric") });
    }

    if (intStepValue > intMaxValue) {
      return Discourse.InputValidation.create({ failed: true, reason: I18n.t("poll_ui.poll_step_must_be_less_than_max") });
    }

    return Discourse.InputValidation.create({ok: true});
  }.property('pollStepValue', 'pollMaxValue'),

  // Validate the Options
  optionsValidation: function() {
    if (this.get("pollType") == "number")
      return Discourse.InputValidation.create({ok: true});

    var options = this.get('pollOptions'),
      numOptions = (options.match(/^(.*)$/gm) || []).length,
      intMinValue = parseInt(this.get('pollMinValue')),
      intMaxValue = parseInt(this.get('pollMaxValue'));

    if (!Ember.isEmpty(this.get("pollOptions")) && numOptions < 2) {
      return Discourse.InputValidation.create({ failed: true, reason: I18n.t("poll_ui.poll_options_must_have_two_entries") });
    }

    if (numOptions < intMinValue || numOptions < intMaxValue) {
      return Discourse.InputValidation.create({ failed: true, reason: I18n.t("poll_ui.poll_options_must_be_greater_than_min_max_values") });
    }
  }.property('pollType', 'pollOptions', 'pollMinValue', 'pollMaxValue'),

  submitDisabled: function() {
    if (this.get("minValueValidation.failed")) return true;
    if (this.get("maxValueValidation.failed")) return true;
    if (this.get("stepValueValidation.failed")) return true;
    if (this.get("optionsValidation.failed")) return true;
    if (this.get("pollType") !== "number" && Ember.isEmpty(this.get("pollOptions"))) return true;
    return false;
  }.property('pollType', 'pollOptions', 'minValueValidation.failed', 'maxValueValidation.failed', 'stepValueValidation.failed', 'optionsValidation.failed'),

  actions: {
    apply: function() {
      var name = this.get("pollName"), type = this.get("pollType"),
        minValue = this.get("pollMinValue"), maxValue = this.get("pollMaxValue"),
        stepValue = this.get("pollStepValue"), options = this.get("pollOptions"),
        answerValue = this.get("pollAnswerValue"), makePublic = this.get("pollMakePublic"),
        self = this, composerOutput = "";

      composerOutput += "[poll";
      composerOutput += (name) ? " name='" + name.replace(/\s/g, '_') + "'" : "";
      composerOutput += (type && type != "regular") ? " type=" + type : "";
      composerOutput += (minValue) ? " min=" + minValue : "";
      composerOutput += (maxValue) ? " max=" + maxValue : "";
      composerOutput += (stepValue && type === "number") ? " step=" + stepValue : "";
      composerOutput += (makePublic || makePublic === 'checked') ? " public=true" : "";
      composerOutput += "]";
      composerOutput += (options && type !== "number") ? "\r\n" + options.replace(/^(.*)/gmi, "* $1") + "\r\n" : "";
      composerOutput += "[/poll]";

      if (!Ember.isEmpty(answerValue)) {
        composerOutput += "\r\n<details><summary>" + I18n.t("poll_ui.poll_answer_summary_title") + "</summary>\r\n";
        composerOutput += answerValue + "\r\n</details>";
      }

      if (self.composerViewOld)
        self.composerViewOld.addMarkdown(composerOutput);
      else if (self.composerView) {
        self.composerView._addText(self.composerView._getSelected(), composerOutput);
      }
      this.send('closeModal');
    }
  },

  refresh: function() {
  },

  onShow: function() {
    this.setProperties({pollName: "", pollType: "regular", pollMinValue: 1,
      pollMaxValue: 1, pollStepValue: 1, pollOptions: "", pollAnswerValue: "", pollMakePublic: false });
  },

  init: function () {
    this._super();

    this.addObserver("pollType", function() {
      this.refresh();
    }.bind(this));
  }
});