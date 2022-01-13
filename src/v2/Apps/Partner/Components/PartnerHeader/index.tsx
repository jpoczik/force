import * as React from "react"
import styled from "styled-components"
import {
  Box,
  Text,
  Image,
  color,
  GridColumns,
  Column,
  Flex,
} from "@artsy/palette"
import { PartnerHeaderAddress } from "./PartnerHeaderAddress"
import { createFragmentContainer, graphql } from "react-relay"
import { FollowProfileButtonFragmentContainer as FollowProfileButton } from "v2/Components/FollowButton/FollowProfileButton"
import { useSystemContext } from "v2/System"
import { ContextModule } from "@artsy/cohesion"
import { RouterLink } from "v2/System/Router/RouterLink"
import { PartnerHeader_partner } from "v2/__generated__/PartnerHeader_partner.graphql"
import { PartnerBanner } from "v2/Apps/Badges/Components/PartnerBanner"
import { diverseGalleries } from "desktop/apps/diverselyOwnedGalleries/data"
export interface PartnerHeaderProps {
  partner: PartnerHeader_partner
}

export const HeaderImage = styled(Image)`
  border: 1px solid ${color("black10")};
  object-fit: contain;
`

export const PartnerHeader: React.FC<PartnerHeaderProps> = ({ partner }) => {
  const { user } = useSystemContext()
  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
  const hasLocations = partner.locations?.totalCount > 0
  // TODO: Remove after page migration.
  const partnerUrl = `/partner/${partner.slug}`
  const canFollow =
    partner && partner.type !== "Auction House" && !!partner.profile

  const diversityBadges = (diverseGalleriesList, partnerSlug) => {
    let badges: Array<string> = []
    console.log(
      "woooo",
      Object.keys(diverseGalleriesList["blackOwnedGalleries"])
    )
    if (
      Object.keys(diverseGalleriesList["blackOwnedGalleries"]).includes(
        partnerSlug
      )
    ) {
      badges.push("Black owned")
    }
    if (
      Object.keys(diverseGalleriesList["lgbtq+OwnedGalleries"]).includes(
        partnerSlug
      )
    ) {
      badges.push("LGBTQ+ owned")
    }
    if (
      Object.keys(diverseGalleriesList["latinxOwnedGalleries"]).includes(
        partnerSlug
      )
    ) {
      badges.push("Latinx owned")
    }
    if (
      Object.keys(diverseGalleriesList["asianOwnedGalleries"]).includes(
        partnerSlug
      )
    ) {
      badges.push("Asian owned")
    }
    if (
      Object.keys(diverseGalleriesList["womenOwnedGalleries"]).includes(
        partnerSlug
      )
    ) {
      badges.push("Women owned")
    }
    if (
      Object.keys(diverseGalleriesList["nonProfitOwnedGalleries"]).includes(
        partnerSlug
      )
    ) {
      badges.push("Non profit")
    }

    return badges
  }

  const allBadges = diversityBadges(diverseGalleries, partner.slug)

  return (
    <GridColumns id="jumpto--PartnerHeader" gridRowGap={2} py={[2, 4]}>
      <Column span={[12, 10]}>
        <Flex>
          {partner.profile?.icon && (
            <Flex mr={2}>
              <RouterLink
                to={partnerUrl}
                style={{ display: "flex", textDecoration: "none" }}
              >
                <HeaderImage
                  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
                  src={partner.profile.icon.resized.src}
                  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
                  srcSet={partner.profile.icon.resized.srcSet}
                  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
                  alt={partner.name}
                  width={[60, 80]}
                  height={[60, 80]}
                />
              </RouterLink>
            </Flex>
          )}
          <Box>
            <Text as="h1" variant="largeTitle">
              <RouterLink
                style={{
                  textDecoration: "none",
                }}
                to={partnerUrl}
              >
                {partner.name}
              </RouterLink>
            </Text>
            {hasLocations && (
              <Text color="black60" variant="text">
                {/* @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION */}
                <PartnerHeaderAddress {...partner.locations} />
              </Text>
            )}
            {allBadges.map(badge => (
              <PartnerBanner badgeCategory={badge} />
            ))}
          </Box>
        </Flex>
      </Column>
      <Column span={[12, 2]}>
        {canFollow && (
          <FollowProfileButton
            profile={partner.profile}
            user={user}
            contextModule={ContextModule.partnerHeader}
            buttonProps={{
              variant: "secondaryOutline",
              width: "100%",
            }}
          />
        )}
      </Column>
    </GridColumns>
  )
}

export const PartnerHeaderFragmentContainer = createFragmentContainer(
  PartnerHeader,
  {
    partner: graphql`
      fragment PartnerHeader_partner on Partner {
        name
        type
        slug
        profile {
          icon {
            resized(width: 80, height: 80, version: "square140") {
              src
              srcSet
            }
          }
          ...FollowProfileButton_profile
        }
        locations: locationsConnection(first: 20) {
          totalCount
          edges {
            node {
              city
            }
          }
        }
      }
    `,
  }
)
