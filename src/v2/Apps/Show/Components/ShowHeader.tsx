import * as React from "react"
import { Box, BoxProps, Join, Spacer, Text } from "@artsy/palette"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowHeader_show } from "v2/__generated__/ShowHeader_show.graphql"
import { useCurrentTime } from "v2/Utils/Hooks/useCurrentTime"
import { useEventTiming } from "v2/Utils/Hooks/useEventTiming"
import { ShowContextualLinkFragmentContainer } from "./ShowContextualLink"

interface ShowHeaderProps extends BoxProps {
  show: ShowHeader_show
}
export const ShowHeader: React.FC<ShowHeaderProps> = ({ show, ...rest }) => {
  const { name, startAt, endAt, formattedStartAt, formattedEndAt } = show

  const currentTime = useCurrentTime({ syncWithServer: true })
  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
  const { formattedTime } = useEventTiming({ currentTime, startAt, endAt })

  return (
    <Box {...rest}>
      <Join separator={<Spacer mb={1} />}>
        <Text variant="xs" textTransform="uppercase">
          Show
        </Text>

        <Box>
          <Text as="h1" variant="xl">
            {name}
          </Text>

          <Text variant="xl" color="black60">
            {formattedStartAt} – {formattedEndAt}
          </Text>
        </Box>

        <Text variant="lg">{formattedTime}</Text>

        <Box mt={[1, 0]}>
          <ShowContextualLinkFragmentContainer show={show} />
        </Box>
      </Join>
    </Box>
  )
}
export const ShowHeaderFragmentContainer = createFragmentContainer(ShowHeader, {
  show: graphql`
    fragment ShowHeader_show on Show {
      name
      startAt
      endAt
      status
      formattedStartAt: startAt(format: "MMMM D")
      formattedEndAt: endAt(format: "MMMM D, YYYY")
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }

      ...ShowContextualLink_show
    }
  `,
})
