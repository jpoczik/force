import { Environment, fetchQuery, graphql } from "relay-runtime"
import { getConvectionGeminiKeyQuery } from "v2/__generated__/getConvectionGeminiKeyQuery.graphql"

export const getConvectionGeminiKey = (relayEnvironment: Environment) =>
  fetchQuery<getConvectionGeminiKeyQuery>(
    relayEnvironment,
    graphql`
      query getConvectionGeminiKeyQuery {
        system {
          services {
            convection {
              geminiTemplateKey
            }
          }
        }
      }
    `,
    {},
    { force: true }
  ).then(data => data.system!.services!.convection.geminiTemplateKey)
