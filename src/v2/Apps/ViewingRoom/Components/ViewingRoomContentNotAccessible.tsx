import * as React from "react";
import { Button, Column, GridColumns, Text } from "@artsy/palette"
import { createFragmentContainer, graphql } from "react-relay"
import { RouterLink } from "v2/System/Router/RouterLink"

import { ViewingRoomContentNotAccessible_viewingRoom } from "v2/__generated__/ViewingRoomContentNotAccessible_viewingRoom.graphql"

interface ViewingRoomContentNotAccessibleProps {
  viewingRoom: ViewingRoomContentNotAccessible_viewingRoom
}

const ViewingRoomContentNotAccessible: React.FC<ViewingRoomContentNotAccessibleProps> = ({
  viewingRoom,
}) => {
  const infoText =
    viewingRoom.status === "scheduled"
      ? "This viewing room is not yet open."
      : "This viewing room is now closed."

  return (
    <GridColumns gridRowGap={4}>
      <Column start={4} span={6}>
        <Text variant="lg">
          {infoText} We invite you to view this gallery's current works.
        </Text>
      </Column>

      {viewingRoom.partner?.href && (
        <Column start={4} span={2}>
          <Button
            width="100%"
            variant="secondaryGray"
            // @ts-ignore
            as={RouterLink}
            to={viewingRoom.partner.href}
          >
            Visit Gallery
          </Button>
        </Column>
      )}
    </GridColumns>
  )
}

export const ViewingRoomContentNotAccessibleFragmentContainer = createFragmentContainer(
  ViewingRoomContentNotAccessible,
  {
    viewingRoom: graphql`
      fragment ViewingRoomContentNotAccessible_viewingRoom on ViewingRoom {
        status
        partner {
          href
        }
      }
    `,
  }
)
