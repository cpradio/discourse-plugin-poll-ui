import StringBuffer from 'discourse/mixins/string-buffer';

export default Ember.View.extend(StringBuffer, {
  result: Em.computed.alias("content"),
  tagName: "div",
  classNames: ["poll-ui-option"],
  rawTemplate: "poll-ui-option.raw",

  optionText: function() {
    return this.get("result")
  }.property("result"),
});
