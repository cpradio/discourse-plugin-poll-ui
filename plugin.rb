# name: discourse-plugin-pollui
# about: Add a button to create a poll
# version: 0.1
# authors: Matthew Wilkin
# url: https://github.com/cpradio/discourse-plugin-pollui

enabled_site_setting :pollui_enabled

register_asset "javascripts/discourse/templates/pollui.hbs"

register_asset 'stylesheets/pollui.scss'