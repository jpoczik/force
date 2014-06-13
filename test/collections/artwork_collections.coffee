_ = require 'underscore'
Backbone = require 'backbone'
sinon = require 'sinon'
CurrentUser = require '../../models/current_user'
ArtworkCollections = require '../../collections/artwork_collections'
Artwork = require '../../models/artwork'
{ fabricate } = require 'antigravity'

describe 'ArtworkCollections', ->

  beforeEach ->
    sinon.stub Backbone, 'sync'
    @user = new CurrentUser fabricate 'user'
    @collections = new ArtworkCollections [], user: @user

  afterEach ->
    Backbone.sync.restore()

  describe '#initialize', ->

    it 'sets the artworks and url when adding a collection', ->
      @collections.add { id: 'saved-artwork' }
      @collections.first().url().should.include '/api/v1/collection/saved-artwork?user_id=' + @user.id
      @collections.first().artworks.url.should.include '/api/v1/collection/saved-artwork/artworks'

    it 'triggers destroy:artwork when a collection artwork is destroyed', ->
      @collections.on 'destroy:artwork', spy = sinon.spy()
      @collections.add { id: 'saved-artwork' }
      @collections.first().artworks.add fabricate 'artwork'
      @collections.first().artworks.first().destroy()
      spy.called.should.be.ok

  describe '#saveArtwork', ->

    it 'saves the artwork to the collection', ->
      @collections.add { id: 'saved-artwork' }
      @collections.first().saveArtwork new Artwork id: 'foo-bar'
      Backbone.sync.args[0][2].url.should
        .include '/api/v1/collection/saved-artwork/artwork/foo-bar?user_id=' + @user.id

    it 'adds the artwork to the collections artworks', ->
      @collections.add { id: 'saved-artwork' }
      @collections.first().saveArtwork new Artwork id: 'foo-bar'
      @collections.first().artworks.first().get('id').should.equal 'foo-bar'

  describe 'comparator', ->

    it 'orders the saved-artwork first', ->
      @collections.reset [{ id: 'foo' }, { id: 'bar' }, { id: 'saved-artwork'}, { id: 'baz' }]
      @collections.first().get('id').should.equal 'saved-artwork'

  describe '#fetchNextArtworksPage', ->

    it 'spawns out fetches for each collections artworks', (done) ->
      @collections.reset [{ id: 'saved-artwork' }, { id: 'cat-portraits' }]
      @collections.fetchNextArtworksPage success: (artworks) ->
        _.pluck(artworks, 'id').join('').should.equal 'foobar'
        done()
      Backbone.sync.args[0][2].success [fabricate 'artwork', id: 'foo']
      Backbone.sync.args[0][2].complete()
      Backbone.sync.args[1][2].success [fabricate 'artwork', id: 'bar']
      Backbone.sync.args[1][2].complete()

    it 'triggers end event when theres no more pages', (done) ->
      @collections.reset [{ id: 'saved-artwork' }, { id: 'cat-portraits' }]
      @collections.on 'end:artworks', done
      @collections.fetchNextArtworksPage()
      Backbone.sync.args[0][2].success []
      Backbone.sync.args[0][2].complete()
      Backbone.sync.args[1][2].success []
      Backbone.sync.args[1][2].complete()

  describe '#get', ->

    it 'changes saved-artwork to My Favorite Works', ->
      @collections.add { id: 'saved-artwork', name: "Saved Artwork" }
      @collections.first().get('name').should.equal 'My Favorite Works'

  describe '#public', ->

    it 'checks wheter all collections are public/private'

  describe '#togglePrivacy', ->

    it 'toggles every collections privacy setting'

