import ModalBodyView from 'discourse/views/modal-body';

export default ModalBodyView.extend({
  title: function () {
    return I18n.t("pollui.modal_title");
  }.property()
});