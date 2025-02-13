import {
  Box,
  BoxProps,
  Column,
  Flex,
  GridColumns,
  ProgressDots,
  ShelfNext,
  ShelfPrevious,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette"

interface ShowBannersRailPlaceholderProps extends BoxProps {
  count: number
}

export const ShowBannersRailPlaceholder: React.FC<ShowBannersRailPlaceholderProps> = ({
  count,
  ...rest
}) => {
  return (
    <Box {...rest}>
      <GridColumns gridRowGap={[3, 2]}>
        <Column span={6}>
          <SkeletonText variant="md" mb={1}>
            Show type
          </SkeletonText>
          <SkeletonText variant="xl">Show name</SkeletonText>
          <SkeletonText variant="lg">Exhibition period</SkeletonText>
          <SkeletonText variant="lg">Location</SkeletonText>
          <SkeletonText mt={1}>
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullam
          </SkeletonText>
          <GridColumns mt={[2, 4]}>
            <Column span={6}>
              <SkeletonBox width="100%" height={40} />
            </Column>
          </GridColumns>
        </Column>
        <Column span={6}>
          <SkeletonBox width="100%" height={[280, 480]} />
        </Column>
      </GridColumns>

      <Spacer my={2} />

      <Flex alignItems="center">
        <Box flex={1}>
          <ProgressDots variant="dash" amount={count} activeIndex={-1} />
        </Box>

        <Spacer ml={2} />

        <ShelfPrevious />

        <Spacer ml={1} />

        <ShelfNext />
      </Flex>
    </Box>
  )
}
