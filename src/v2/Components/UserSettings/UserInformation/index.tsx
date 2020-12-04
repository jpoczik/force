import React from "react"
import QuickInput from "v2/Components/QuickInput"
import {
  QueryRenderer,
  RelayRefetchProp,
  createRefetchContainer,
  graphql,
} from "react-relay"
import { useSystemContext } from "v2/Artsy/SystemContext"
import { renderWithLoadProgress } from "v2/Artsy/Relay/renderWithLoadProgress"
import { Form, Formik, FormikProps } from "formik"
import { Error } from "v2/Components/Authentication/commonElements"
import { UserInformation_me } from "v2/__generated__/UserInformation_me.graphql"
import { UserInformationQuery } from "v2/__generated__/UserInformationQuery.graphql.ts"
import { Box, Button, Serif, Text, space } from "@artsy/palette"
import { ChangeUserInformationValidator } from "v2/Components/Authentication/Validators"
import { PasswordInput } from "v2/Components/PasswordInput"
import { SystemContextProps } from "@artsy/reaction/dist/Artsy"
import { UpdateUserInformation } from "./UpdateUserInformationMutation"
import {
  UpdateMyProfileInput,
  UpdateUserInformationMutationResponse,
} from "v2/__generated__/UpdateUserInformationMutation.graphql"

interface UserInformationProps extends SystemContextProps {
  me: UserInformation_me
  relay: RelayRefetchProp
}

export const UserInformation: React.FC<UserInformationProps> = ({
  me,
  relay,
}) => {
  const { relayEnvironment } = useSystemContext()

  const onSubmit = async (
    { email, name, phone, password }: UpdateMyProfileInput,
    formikBag: FormikProps<any>
  ) => {
    formikBag.setStatus({ error: undefined })
    try {
      const {
        updateMyUserProfile: { userOrError },
      } = await UpdateUserInformation(relayEnvironment, {
        email,
        name,
        password,
        phone,
      })
      if (userOrError.mutationError) {
        const { message, fieldErrors } = userOrError.mutationError
        if (fieldErrors) {
          // display errors for a specified form field
          const formattedErrors = formatGravityErrors(userOrError.mutationError)
          formikBag.setErrors(formattedErrors)
        } else if (message) {
          // display generic gravity error
          formikBag.setStatus({ error: message })
        }
      } else {
        formikBag.resetForm()
      }
    } catch (err) {
      formikBag.setErrors(err)
    }
  }

  return (
    <Box>
      <Serif size="6" mb={space(2)}>
        Information
      </Serif>
      <Formik
        initialValues={me}
        validationSchema={ChangeUserInformationValidator}
        onSubmit={onSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          status,
          touched,
          values,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Text>Full name</Text>
            <QuickInput
              error={errors.name as any}
              placeholder="Enter your full name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Text>Email</Text>
            <QuickInput
              block
              error={errors.email as any}
              placeholder="Enter your email address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Text>Mobile number</Text>
            <QuickInput
              block
              placeholder="Enter your mobile phone number"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {me.paddleNumber && (
              <>
                <Text>Bidder number</Text>
                <QuickInput
                  block
                  name="paddleNumber"
                  value={me.paddleNumber}
                  readOnly
                />
              </>
            )}
            <input name="internalID" value={me.internalID} hidden readOnly />
            {touched.email && values.email !== me.email && (
              <>
                <Text>Password</Text>
                <PasswordInput
                  autoFocus
                  block
                  error={
                    !values.password && "Password is required to change email."
                  }
                  placeholder="Enter your password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </>
            )}
            {status && !status.success && <Error show>{status.error}</Error>}
            <Button
              type="submit"
              size="large"
              loading={isSubmitting}
              width="100%"
              variant="secondaryOutline"
            >
              Save changes
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export const UserInformationRefetchContainer = createRefetchContainer(
  UserInformation,
  {
    me: graphql`
      fragment UserInformation_me on Me {
        email
        name
        paddleNumber
        phone
        internalID
      }
    `,
  },
  graphql`
    query UserInformationRefetchQuery {
      me {
        ...UserInformation_me
      }
    }
  `
)

export const UserInformationQueryRenderer = () => {
  const { user, relayEnvironment } = useSystemContext()

  if (!user) {
    return null
  }

  return (
    <QueryRenderer<UserInformationQuery>
      environment={relayEnvironment}
      variables={{}}
      query={graphql`
        query UserInformationQuery @raw_response_type {
          me {
            ...UserInformation_me
          }
        }
      `}
      render={renderWithLoadProgress(UserInformationRefetchContainer)}
    />
  )
}

type GravityFieldErrors = UpdateUserInformationMutationResponse["updateMyUserProfile"]["userOrError"]["mutationError"]

const formatGravityErrors = ({ fieldErrors }: GravityFieldErrors) => {
  const formatted = {}
  fieldErrors.map(err => {
    formatted[err["name"]] = err.message.split(", ")
  })
  return formatted
}