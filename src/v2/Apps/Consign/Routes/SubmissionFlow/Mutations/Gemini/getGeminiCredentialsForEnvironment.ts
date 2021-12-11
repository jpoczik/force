import { commitMutation, Environment, graphql } from "relay-runtime"
import {
  RequestCredentialsForAssetUploadInput,
  getGeminiCredentialsForEnvironmentMutationResponse,
  getGeminiCredentialsForEnvironmentMutation,
} from "v2/__generated__/getGeminiCredentialsForEnvironmentMutation.graphql"

export type AssetCredentials =
  | NonNullable<
      getGeminiCredentialsForEnvironmentMutationResponse["requestCredentialsForAssetUpload"]
    >["asset"]
  | undefined

export const getGeminiCredentialsForEnvironment = (
  relayEnvironment: Environment,
  input: RequestCredentialsForAssetUploadInput
) => {
  return new Promise<AssetCredentials>((resolve, reject) => {
    commitMutation<getGeminiCredentialsForEnvironmentMutation>(
      relayEnvironment,
      {
        // PLEASE_FIXME: REMOVE_THIS_COMMENT_RELAY_UPGRADE
        mutation: graphql`
          mutation getGeminiCredentialsForEnvironmentMutation(
            $input: RequestCredentialsForAssetUploadInput!
          ) {
            requestCredentialsForAssetUpload(input: $input) {
              asset {
                signature
                credentials
                policyEncoded
                policyDocument {
                  expiration
                  conditions {
                    acl
                    bucket
                    geminiKey
                    successActionStatus
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: {
            ...input,
            clientMutationId: Math.random().toString(8),
          },
        },
        onError: reject,
        onCompleted: (response, errors) => {
          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors)))
          } else {
            resolve(response.requestCredentialsForAssetUpload?.asset)
          }
        },
      }
    )
  })
}
