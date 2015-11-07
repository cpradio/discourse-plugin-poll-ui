import showModal from 'discourse/lib/show-modal';
import ApplicationRoute from 'discourse/routes/application';
import ComposerView from 'discourse/views/composer';
import { onToolbarCreate } from 'discourse/components/d-editor';

export default
{
  name: 'poll-ui',
  initialize()
  {
    const siteSettings = container.lookup('site-settings:main');

    if (Discourse.SiteSettings.poll_ui_enabled) {
      if (typeof Discourse.ComposerEditorComponent === "undefined") {
        ApplicationRoute.reopen({
          actions: {
            showPollUI: function (composerView) {
              showModal('poll-ui');
              this.controllerFor('poll-ui').setProperties({composerView: composerView});
            }
          }
        });

        ComposerView.reopen({
          initEditor: function () {
            // overwrite and wrap.
            this._super();
            var view = this;
            var button_text = I18n.t("poll_ui.composer_button_text");
            var btn = $('<button class="wmd-button wmd-poll-ui-button" title="' + button_text + '" aria-label="' + button_text + '"></button>');
            btn.click(function () {
              view.get("controller").send("showPollUI", view);
            });
            $("#wmd-button-row,.wmd-button-row").append(btn);
          }
        });
      } else {
        Discourse.DEditorComponent.reopen({
          actions: {
            showPollUI: function() {
              showModal('poll-ui');
            }
          }
        });

        onToolbarCreate(toolbar => {
          toolbar.addButton({
            id: "poll_ui_button",
            group: "extras",
            icon: "bar-chart",
            action: 'showPollUI'
          });
        });
      }
    }
  }
};