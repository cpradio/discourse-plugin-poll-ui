import showModal from 'discourse/lib/show-modal';
import ApplicationRoute from 'discourse/routes/application';
import ComposerView from 'discourse/views/composer';

export default
{
  name: 'pollui',
  initialize()
  {
    ApplicationRoute.reopen({
      actions: {
        showImgFlip: function (composerView) {
          showModal('pollui');
          this.controllerFor('pollui').setProperties({composerView: composerView});
        }
      }
    });

    ComposerView.reopen({
      initEditor: function () {
        // overwrite and wrap.
        this._super();
        if (Discourse.SiteSettings.pollui_enabled) {
          var view = this;
          var button_text = I18n.t("pollui.composer_button_text");
          var btn = $('<button class="wmd-button wmd-pollui-button" title="' + button_text + '" aria-label="' + button_text + '"></button>');
          btn.click(function () {
            view.get("controller").send("showPollUI", view);
          });
          $("#wmd-button-row,.wmd-button-row").append(btn);
        }
      }
    });
  }
};