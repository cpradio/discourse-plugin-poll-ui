export default Ember.View.extend({
  result: Em.computed.alias("content"),
  tagName: "div",
  classNames: ["option-input"],
  templateName: "poll-ui-option",

  idName: function() {
    return "option" + this.get("result.id")
  }.property("result"),

  optionText: function() {
    return this.get("result.text")
  }.property("result"),

  actions: {
    deleteEntry: function() {
      this.get("controller").send("deleteOption", this.get("result.id"));
    }
  }
});
