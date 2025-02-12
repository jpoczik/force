import loadable from "@loadable/component"
import { RedirectException } from "found"
import { AppRouteConfig } from "v2/System/Router/Route"
import { checkForRedirect } from "./Server/checkForRedirect"
import { setReferer } from "./Server/setReferer"
import { flow } from "lodash"
import { redirectIfLoggedIn } from "./Server/redirectIfLoggedIn"
import { setCookies } from "./Utils/helpers"
import { redirectPostAuth } from "./Server/redirectPostAuth"

const ForgotPasswordRoute = loadable(
  () =>
    import(
      /* webpackChunkName: "authenticationBundle" */ "./Routes/ForgotPasswordRoute"
    ),
  { resolveComponent: component => component.ForgotPasswordRoute }
)

const ResetPasswordRoute = loadable(
  () =>
    import(
      /* webpackChunkName: "authenticationBundle" */ "./Routes/ResetPasswordRoute"
    ),
  { resolveComponent: component => component.ResetPasswordRoute }
)

const LoginRoute = loadable(
  () =>
    import(
      /* webpackChunkName: "authenticationBundle" */ "./Routes/LoginRoute"
    ),
  { resolveComponent: component => component.LoginRoute }
)

const SignupRoute = loadable(
  () =>
    import(
      /* webpackChunkName: "authenticationBundle" */ "./Routes/SignupRoute"
    ),
  { resolveComponent: component => component.SignupRoute }
)

const runAuthMiddleware = flow(checkForRedirect, setReferer)

export const authenticationRoutes: AppRouteConfig[] = [
  {
    path: "/forgot",
    hideNav: true,
    hideFooter: true,
    getComponent: () => ForgotPasswordRoute,
    onServerSideRender: ({ req, res }) => {
      res.locals.sd.RESET_PASSWORD_REDIRECT_TO =
        req.query.reset_password_redirect_to

      // Used to customize reset copy/emails for partners etc
      res.locals.sd.SET_PASSWORD = req.query.set_password

      runAuthMiddleware({ req, res })
    },
  },
  {
    path: "/login",
    hideNav: true,
    hideFooter: true,
    getComponent: () => LoginRoute,
    onServerSideRender: props => {
      // We need this check so we allow someone to log into the API even if they
      // have already logged into force. Otherwise, we short-circuit and risk
      // taking the user into an infinite redirect loop.
      if (!props.req.query.oauthLogin) {
        redirectIfLoggedIn(props)
      }

      runAuthMiddleware(props)
    },
    onClientSideRender: ({ match }) => {
      setCookies(match.location.query)
      LoginRoute.preload()
    },
  },
  {
    path: "/log_in",
    render: ({ match }) => {
      throw new RedirectException(`/login${match.location.search}`, 301)
    },
  },
  {
    path: "/reset_password",
    hideNav: true,
    hideFooter: true,
    getComponent: () => ResetPasswordRoute,
    onServerSideRender: ({ req, res }) => {
      if (!req.query.reset_password_token) {
        res.redirect("/")
      }
      runAuthMiddleware({ req, res })
    },
    onClientSideRender: ({ match }) => {
      setCookies(match.location.query)
      ResetPasswordRoute.preload()
    },
  },
  {
    path: "/signup",
    hideNav: true,
    hideFooter: true,
    getComponent: () => SignupRoute,
    onServerSideRender: props => {
      // We need this check so we allow someone to log into the API even if they
      // have already logged into force. Otherwise, we short-circuit and risk
      // taking the user into an infinite redirect loop.
      if (!props.req.query.oauthLogin) {
        redirectIfLoggedIn(props)
      }

      runAuthMiddleware(props)
    },
    onClientSideRender: ({ match }) => {
      setCookies(match.location.query)
      SignupRoute.preload()
    },
  },
  {
    path: "/sign_up",
    render: ({ match }) => {
      throw new RedirectException(`/signup${match.location.search}`, 301)
    },
  },
  {
    path: "/auth-redirect",
    onServerSideRender: props => {
      redirectPostAuth(props)
    },
  },
]
