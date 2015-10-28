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

  actions: {
    apply: function() {
      var selectedMeme = this.get("selectedMeme"),
          topText = this.get("topText"), bottomText = this.get("bottomText"),
          self = this;
      Discourse.ajax(this.getUrl("caption_image") + "&template_id=" + selectedMeme +
        "&text0=" + topText + "&text1=" + bottomText).then(
          function(resp) {
            self.composerView.addMarkdown("![](" + resp.data.url + ")");
          }.bind(this)
      );
      this.set("selectedMeme", undefined);
      this.send('closeModal');
    }
  },

  refresh: function() {
  },

  init: function () {
    this._super();
    this.setProperties({pollName: "", pollType: I18n.t("poll_ui.poll_type.regular"), pollMinValue: 1, pollMaxValue: 1, pollStepValue: 1 });
  }
});