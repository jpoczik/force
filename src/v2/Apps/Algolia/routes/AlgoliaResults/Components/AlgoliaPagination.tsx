import { Box, Pagination } from "@artsy/palette"
import { useScrollTo } from "v2/Utils/Hooks/useScrollTo"
import { ANCHOR_CONTAINER_ID } from "v2/Apps/Algolia/constants"
import { createPageCursors } from "v2/Apps/Algolia/Utils/pagination"

interface AlgoliaPaginationProps {
  nbPages: number
  currentRefinement: number
  refine: (page: number) => void
}

export const AlgoliaPagination: React.FC<AlgoliaPaginationProps> = props => {
  const { nbPages, currentRefinement, refine } = props
  const { scrollTo } = useScrollTo({
    selectorOrRef: `#${ANCHOR_CONTAINER_ID}`,
    behavior: "smooth",
  })

  const handleSelectPage = (page: number) => {
    refine(page)
    scrollTo()
  }

  if (nbPages !== 0) {
    const pageCursors = createPageCursors(currentRefinement, nbPages)

    return (
      <Box my={1}>
        <Pagination
          hasNextPage={currentRefinement < nbPages}
          onClick={(_cursor, page, event) => {
            event.preventDefault()
            handleSelectPage(page)
          }}
          onNext={(event, page) => {
            event.preventDefault()
            handleSelectPage(page)
          }}
          pageCursors={pageCursors}
        />
      </Box>
    )
  }

  return null
}
