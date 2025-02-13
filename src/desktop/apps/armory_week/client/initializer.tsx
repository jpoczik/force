import ReactDOM from "react-dom"
import { BannerPopUp } from "desktop/components/fair_week_marketing/BannerPopUp"

const bootstrapData = window.__BOOTSTRAP__
const {
  ctaTitle,
  ctaImageUrl,
  overlayModalTitle,
  overlayModalImageUrl,
} = bootstrapData.bannerPopUp

ReactDOM.render(
  <BannerPopUp
    {...{ ctaTitle, ctaImageUrl, overlayModalTitle, overlayModalImageUrl }}
  />,
  document.getElementById("react-root-for-cta")
)
