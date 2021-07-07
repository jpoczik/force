import loadable from "@loadable/component"
import { graphql } from "react-relay"
import { AppRouteConfig } from "v2/System/Router/Route"

const FeatureApp = loadable(
  () =>
    import(
      /* webpackChunkName: "featureBundle", webpackPrefetch: true */ "./FeatureApp"
    ),
  {
    resolveComponent: component => component.FeatureAppFragmentContainer,
  }
)

export const featureRoutes: AppRouteConfig[] = [
  {
    path: "/feature/:slug",
    getComponent: () => FeatureApp,
    prepare: () => {
      FeatureApp.preload()
    },
    query: graphql`
      query featureRoutes_FeatureQuery($slug: ID!) {
        feature(id: $slug) @principalField {
          ...FeatureApp_feature
        }
      }
    `,
  },
]
