export default Ember.View.extend({
  result: Em.computed.alias("content"),
  tagName: "div",
  classNames: ["option-input"],
  templateName: "poll-ui-option",

  optionText: function() {
    return this.get("result")
  }.property("result"),
});
