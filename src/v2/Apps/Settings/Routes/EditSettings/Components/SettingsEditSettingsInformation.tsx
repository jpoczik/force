import * as React from "react"
import * as Yup from "yup"
import { createFragmentContainer, graphql } from "react-relay"
import { Form, Formik } from "formik"
import { SettingsEditSettingsInformation_me } from "v2/__generated__/SettingsEditSettingsInformation_me.graphql"
import {
  Button,
  Text,
  Input,
  Join,
  Spacer,
  useToasts,
  PasswordInput,
} from "@artsy/palette"
import { email, password, name } from "v2/Components/Authentication/Validators"
import { useUpdateSettingsInformation } from "./useUpdateSettingsInformation"

interface SettingsEditSettingsInformationProps {
  me: SettingsEditSettingsInformation_me
}

export const SettingsEditSettingsInformation: React.FC<SettingsEditSettingsInformationProps> = ({
  me,
}) => {
  const { sendToast } = useToasts()
  const { submitUpdateSettingsInformation } = useUpdateSettingsInformation()

  return (
    <>
      <Text variant="lg" mb={4}>
        Information
      </Text>

      <Formik
        validateOnBlur
        validateOnChange
        initialValues={{
          name: me.name ?? "",
          email: me.email ?? "",
          phone: me.phone ?? "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email,
          name,
          // Requires password when email is changed
          password: password.when("email", {
            is: email => email !== me.email,
            otherwise: field => field.notRequired(),
          }),
        })}
        onSubmit={async ({ email, name, password, phone }) => {
          try {
            await submitUpdateSettingsInformation({
              email,
              name,
              password,
              phone,
            })

            sendToast({
              variant: "success",
              message: "Information updated successfully",
            })
          } catch (err) {
            console.error(err)

            sendToast({
              variant: "error",
              message: "There was a problem",
              description: err.message,
            })
          }
        }}
      >
        {({ errors, handleBlur, handleChange, isSubmitting, values }) => (
          <Form>
            <Join separator={<Spacer mt={2} />}>
              <Input
                title="Full Name"
                name="name"
                error={errors.name}
                placeholder="Enter your full name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="name"
              />

              <Input
                title="Email"
                name="email"
                error={errors.email}
                placeholder="Enter your email address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
                required
                autoComplete="email"
              />

              <Input
                title="Mobile Number"
                name="phone"
                placeholder="Enter your mobile phone number"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                type="tel"
                autoComplete="tel"
              />

              {me.paddleNumber && (
                <Input
                  name="paddleNumber"
                  title="Bidder Number"
                  value={me.paddleNumber}
                  readOnly
                  disabled
                />
              )}

              {values.email !== me.email && (
                <PasswordInput
                  name="password"
                  title="Password"
                  error={errors.password}
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="current-password"
                />
              )}

              <Button mt={2} type="submit" loading={isSubmitting}>
                Save Changes
              </Button>
            </Join>
          </Form>
        )}
      </Formik>
    </>
  )
}

export const SettingsEditSettingsInformationFragmentContainer = createFragmentContainer(
  SettingsEditSettingsInformation,
  {
    me: graphql`
      fragment SettingsEditSettingsInformation_me on Me {
        email
        name
        paddleNumber
        phone
      }
    `,
  }
)
