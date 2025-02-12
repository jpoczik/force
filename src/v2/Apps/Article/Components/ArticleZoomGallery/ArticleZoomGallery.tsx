import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Box,
  Clickable,
  CloseIcon,
  Flex,
  ModalBase,
  Spinner,
  Text,
} from "@artsy/palette"
import { FC, useMemo, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { SystemQueryRenderer } from "v2/System/Relay/SystemQueryRenderer"
import { ArticleZoomGallery_article } from "v2/__generated__/ArticleZoomGallery_article.graphql"
import { ArticleZoomGalleryQuery } from "v2/__generated__/ArticleZoomGalleryQuery.graphql"
import { useCursor } from "use-cursor"
import { compact } from "lodash"
import styled from "styled-components"
import { themeGet } from "@styled-system/theme-get"
import { ArticleZoomGalleryFigureFragmentContainer } from "./ArticleZoomGalleryFigure"
import { ArticleZoomGalleryCaptionFragmentContainer } from "./ArticleZoomGalleryCaption"
import { useNextPrevious } from "v2/Utils/Hooks/useNextPrevious"

interface ArticleZoomGalleryProps {
  article: ArticleZoomGallery_article
  figureId?: string
  onClose: () => void
}

const ArticleZoomGallery: FC<ArticleZoomGalleryProps> = ({
  article,
  figureId,
  onClose,
}) => {
  // Flattens out all figures from the sections into a single array
  const figures = useMemo(() => {
    return compact(
      article.sections.flatMap(section => {
        if (
          section.__typename === "ArticleSectionImageSet" ||
          section.__typename === "ArticleSectionImageCollection"
        ) {
          return section.figures
        }
      })
    )
  }, [article])

  // Finds the index of the given figure ID to start the gallery at
  const initialCursor = figures.findIndex(figure => {
    if (
      figure.__typename === "Artwork" ||
      figure.__typename === "ArticleImageSection"
    ) {
      return figure.id === figureId
    }
  })

  const { index, handleNext, handlePrev } = useCursor({
    max: figures.length,
    initialCursor: initialCursor === -1 ? 0 : initialCursor,
  })

  const figure = figures[index]

  const { containerRef } = useNextPrevious({
    onNext: handleNext,
    onPrevious: handlePrev,
  })

  return (
    <ModalBase onClose={onClose}>
      <Box bg="white100" width="100vw" height="100vh" ref={containerRef as any}>
        <Close onClick={onClose}>
          <CloseIcon width={30} height={30} fill="currentColor" />
        </Close>

        <NextPrevious onClick={handlePrev} left={0}>
          <ArrowLeftIcon fill="currentColor" width={30} height={30} />
        </NextPrevious>

        <NextPrevious onClick={handleNext} right={0}>
          <ArrowRightIcon fill="currentColor" width={30} height={30} />
        </NextPrevious>

        <Flex flexDirection="column" height="100%">
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            flex={1}
            minHeight={0}
          >
            <ArticleZoomGalleryFigureFragmentContainer figure={figure} />
          </Flex>

          <Flex
            p={4}
            bg="black5"
            justifyContent="space-between"
            alignItems="center"
          >
            <ArticleZoomGalleryCaptionFragmentContainer figure={figure} />

            <Text variant="sm" ml={2} flexShrink={0}>
              {index + 1} of {figures.length}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </ModalBase>
  )
}

const Close = styled(Clickable).attrs({ p: 2 })`
  position: absolute;
  top: 0;
  right: 0;
  color: ${themeGet("colors.black60")};
  transition: color 250ms;
  z-index: 1;

  &:hover {
    color: ${themeGet("colors.black100")};
  }
`

const NextPrevious = styled(Clickable).attrs({
  p: 2,
})`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: ${themeGet("colors.white100")};
  transition: color 250ms;
  z-index: 1;
  mix-blend-mode: difference;

  &:hover {
    color: ${themeGet("colors.black60")};
  }
`

export const ArticleZoomGalleryFragmentContainer = createFragmentContainer(
  ArticleZoomGallery,
  {
    article: graphql`
      fragment ArticleZoomGallery_article on Article {
        sections {
          __typename
          ... on ArticleSectionImageCollection {
            figures {
              ...ArticleZoomGalleryFigure_figure
              ...ArticleZoomGalleryCaption_figure
              __typename
              ... on Artwork {
                id
              }
              ... on ArticleImageSection {
                id
              }
            }
          }
          ... on ArticleSectionImageSet {
            figures {
              ...ArticleZoomGalleryFigure_figure
              ...ArticleZoomGalleryCaption_figure
              __typename
              ... on Artwork {
                id
              }
              ... on ArticleImageSection {
                id
              }
            }
          }
        }
      }
    `,
  }
)

const ArticleZoomGalleryPlaceholder: FC = () => {
  return (
    <ModalBase bg="rgba(255, 255, 255, 0.8)">
      <Spinner />
    </ModalBase>
  )
}

export const ARTICLE_ZOOM_GALLERY_QUERY = graphql`
  query ArticleZoomGalleryQuery($id: String!) {
    article(id: $id) {
      ...ArticleZoomGallery_article
    }
  }
`

interface ArticleZoomGalleryRefetchContainerProps {
  id: string
  figureId?: string
  onClose: () => void
}

export const ArticleZoomGalleryRefetchContainer: FC<ArticleZoomGalleryRefetchContainerProps> = ({
  id,
  figureId,
  onClose,
}) => {
  return (
    <SystemQueryRenderer<ArticleZoomGalleryQuery>
      query={ARTICLE_ZOOM_GALLERY_QUERY}
      variables={{ id }}
      placeholder={<ArticleZoomGalleryPlaceholder />}
      render={({ props, error }) => {
        if (error) {
          console.error(error)
          return null
        }

        if (!props?.article) {
          return <ArticleZoomGalleryPlaceholder />
        }

        return (
          <ArticleZoomGalleryFragmentContainer
            article={props.article}
            onClose={onClose}
            figureId={figureId}
          />
        )
      }}
    />
  )
}

interface UseArticleZoomGalleryProps {
  id: string
}

export const useArticleZoomGallery = ({ id }: UseArticleZoomGalleryProps) => {
  const [
    isArticleZoomGalleryVisible,
    setIsArticleZoomGalleryVisible,
  ] = useState(false)

  const [figureId, setFigureId] = useState<string | undefined>()

  const showArticleZoomGallery = (nextFigureId: string) => {
    nextFigureId && setFigureId(nextFigureId)
    setIsArticleZoomGalleryVisible(true)
  }

  const hideArticleZoomGallery = () => {
    setIsArticleZoomGalleryVisible(false)
  }

  const articleZoomGalleryComponent = (
    <>
      {isArticleZoomGalleryVisible && (
        <ArticleZoomGalleryRefetchContainer
          id={id}
          figureId={figureId}
          onClose={hideArticleZoomGallery}
        />
      )}
    </>
  )

  return {
    articleZoomGalleryComponent,
    hideArticleZoomGallery,
    isArticleZoomGalleryVisible,
    showArticleZoomGallery,
  }
}
