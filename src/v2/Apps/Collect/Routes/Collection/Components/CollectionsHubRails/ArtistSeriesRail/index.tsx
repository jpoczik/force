import { ArtistSeriesRail_collectionGroup } from "v2/__generated__/ArtistSeriesRail_collectionGroup.graphql"
import * as React from "react";
import { createFragmentContainer, graphql } from "react-relay"
import { ArtistSeriesRailContainer as ArtistSeriesEntity } from "./ArtistSeriesEntity"
import { Rail } from "v2/Components/Rail"

export interface ArtistSeriesRailProps {
  collectionGroup: ArtistSeriesRail_collectionGroup
}
export const ArtistSeriesRail: React.FC<ArtistSeriesRailProps> = ({
  collectionGroup: { members, name },
}) => {
  return (
    <Rail
      title={name}
      getItems={() => {
        return members.map((slide, slideIndex) => {
          return (
            <ArtistSeriesEntity
              key={slide.slug || slideIndex}
              member={slide}
              itemNumber={slideIndex}
            />
          )
        })
      }}
    />
  )
}

export const ArtistSeriesRailContainer = createFragmentContainer(
  ArtistSeriesRail as React.FC<ArtistSeriesRailProps>,
  {
    collectionGroup: graphql`
      fragment ArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
        groupType
        name
        members {
          slug
          ...ArtistSeriesEntity_member
        }
      }
    `,
  }
)
