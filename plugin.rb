# name: discourse-plugin-poll-ui
# about: Add a button to create a poll
# version: 0.3
# authors: Matthew Wilkin
# url: https://github.com/cpradio/discourse-plugin-poll-ui

enabled_site_setting :pollui_enabled

register_asset "javascripts/discourse/templates/poll-ui.hbs"

register_asset 'stylesheets/poll-ui.scss'