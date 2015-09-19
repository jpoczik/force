_ = require 'underscore'
request = require 'superagent'
{ GALLERY_INSIGHTS_LIST, MAILCHIMP_KEY } = require '../../config'


@index = (req, res) ->
  res.render 'index'

@form = (req, res, next) ->
  request.post('https://us1.api.mailchimp.com/2.0/lists/subscribe')
    .send(
      apikey: MAILCHIMP_KEY
      id: GALLERY_INSIGHTS_LIST
      email: email: req.body.email
      merge_vars:
        FNAME: req.body.fname
        LNAME: req.body.lname
        MMERGE3: 'Opt-in (artsy.net)'
        GSITE: req.body.gsite
        GNAME: req.body.gname
        TKDL: 'Yes'
      double_optin: false
      send_welcome: false
    ).end (err, response) ->
      return next err if err
      res.send(response?.status, response?.body or response?.text or err)