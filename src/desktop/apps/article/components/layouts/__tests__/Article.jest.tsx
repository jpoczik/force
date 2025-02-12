import { ArticleLayout } from "../Article"
import { mount } from "enzyme"
import { SystemContextProvider } from "@artsy/reaction/dist/Artsy"
import { InfiniteScrollArticle } from "../../InfiniteScrollArticle"
import {
  BasicArticle,
  FeatureArticle,
  SeriesArticleSponsored,
  StandardArticle,
} from "@artsy/reaction/dist/Components/Publishing/Fixtures/Articles"
import { clone } from "lodash"
import { ArticleData } from "@artsy/reaction/dist/Components/Publishing/Typings"
import { Article } from "@artsy/reaction/dist/Components/Publishing/Article"

jest.mock("desktop/components/article/client/super_article.coffee")
const mockSuperArticleView = require("desktop/components/article/client/super_article.coffee") as jest.Mock

describe("Article Layout", () => {
  let props
  const getWrapper = (passedProps = props) => {
    return mount(
      <SystemContextProvider user={null}>
        <ArticleLayout {...passedProps} />
      </SystemContextProvider>
    )
  }

  beforeEach(() => {
    props = {
      article: StandardArticle,
      templates: {},
    }
  })

  it("renders a standard article", () => {
    const component = getWrapper()
    expect(component.find(InfiniteScrollArticle).length).toBe(1)
    expect(component.html()).toMatch("StandardLayout")
  })

  it("renders a feature article", () => {
    props.article = FeatureArticle
    const component = getWrapper()
    expect(component.find(InfiniteScrollArticle).length).toBe(1)
    expect(component.html()).toMatch("FeatureLayout")
  })

  it("renders a feature fullscreen article in a series", () => {
    props.article = clone({
      ...FeatureArticle,
      seriesArticle: SeriesArticleSponsored,
      relatedArticles: [StandardArticle, BasicArticle],
    } as ArticleData)
    const component = getWrapper()

    expect(component.find(InfiniteScrollArticle).length).toBe(0)
    expect(component.html()).toMatch("FeatureLayout")
  })

  it("renders Related Articles", () => {
    props.article = clone({
      ...StandardArticle,
      relatedArticlesPanel: [FeatureArticle, BasicArticle],
    } as ArticleData)
    const component = getWrapper()
    expect(component.html()).toMatch("Related Stories")
    expect(component.html()).toMatch("RelatedArticlesPanel")
    expect(component.html()).toMatch(FeatureArticle.title)
  })

  describe("SuperArticle", () => {
    it("renders a static article for super articles", () => {
      props.isSuper = true
      const component = getWrapper()
      expect(component.find(Article).length).toBe(1)
      expect(component.find(InfiniteScrollArticle).length).toBe(0)
    })

    it("mounts backbone views for super articles", () => {
      props.templates = {
        SuperArticleFooter: "sa-footer",
        SuperArticleHeader: "sa-header",
      }
      props.isSuper = true
      const component = getWrapper()

      expect(component.html()).toMatch("sa-footer")
      expect(component.html()).toMatch("sa-header")
      expect(mockSuperArticleView).toBeCalled()

      expect(mockSuperArticleView.mock.calls[0][0].article.get("title")).toBe(
        "New York's Next Art District"
      )
    })
  })
})
