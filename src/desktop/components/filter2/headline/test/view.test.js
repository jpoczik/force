/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const benv = require("benv")
const Backbone = require("backbone")
const { resolve } = require("path")
const { fabricate, fabricate2 } = require("@artsy/antigravity")
const { Fair } = require("../../../../models/fair")
const { FilterArtworks } = require("../../../../collections/filter_artworks")

describe("Filter / Headline", function () {
  beforeEach(function (done) {
    return benv.setup(() => {
      benv.expose({ $: benv.require("jquery") })
      Backbone.$ = $
      const HeadlineView = benv.require(resolve(__dirname, "../view"))
      const fair = new Fair(fabricate("fair"))
      this.view = new HeadlineView({
        el: $("<div></div>"),
        params: new Backbone.Model(),
        collection: new FilterArtworks(fabricate2("filter_artworks"), {
          parse: true,
        }),
        facets: ["price_range", "dimension_range", "medium"],
        stuckParam: { fair_id: fair.id },
      })

      return done()
    })
  })

  afterEach(() => benv.teardown())

  it("renders the headline properly", function () {
    this.view.params.set({
      price_range: "*-1000",
      medium: "film-slash-video",
      dimension_range: "*-24.0",
    })

    return this.view.$el.text().should.equal("Small Film / video Under $1,000")
  })

  it("says artwork if no medium is available and does not treat fair as a stuck param", function () {
    this.view.params.set({
      price_range: "*-1000",
      dimension_range: "*-24.0",
    })

    return this.view.$el.text().should.equal("Small Artworks Under $1,000")
  })

  it("says nothing if no params are set", function () {
    return this.view.$el.text().should.equal("")
  })

  return it("uses a defaultHeading in place of a medium", function () {
    this.view.defaultHeading = "Thing"
    this.view.params.set({
      price_range: "*-1000",
      dimension_range: "*-24.0",
    })

    return this.view.$el.text().should.equal("Small Thing Under $1,000")
  })
})
