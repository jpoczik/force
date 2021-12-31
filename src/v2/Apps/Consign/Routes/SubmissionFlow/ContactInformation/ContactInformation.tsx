import { Text, Button } from "@artsy/palette"
import { SubmissionStepper } from "v2/Apps/Consign/Components/SubmissionStepper"
import { useSystemContext } from "v2/System"
import { useRouter } from "v2/System/Router/useRouter"
import { createConsignSubmission } from "../Utils/createConsignSubmission"
import { Form, Formik } from "formik"
import {
  ContactInformationForm,
  ContactInformationFormModel,
} from "./Components/ContactInformationForm"
import { createFragmentContainer, graphql } from "react-relay"
import { ContactInformation_me } from "v2/__generated__/ContactInformation_me.graphql"
import { useSubmission } from "../Utils/useSubmission"
import { contactInformationValidationSchema } from "../Utils/validation"
import { BackLink } from "v2/Components/Links/BackLink"
import { useErrorModal } from "../Utils/useErrorModal"
import { getENV } from "v2/Utils/getENV"
import { recaptcha, RecaptchaAction } from "v2/Utils/recaptcha"

const getContactInformationFormInitialValues = (
  me: ContactInformation_me
): ContactInformationFormModel => ({
  name: me?.name || "",
  email: me?.email || "",
  phone: {
    isValid: !!me?.phoneNumber?.isValid,
    national: me?.phoneNumber?.national ?? undefined,
    international: me?.phoneNumber?.international ?? undefined,
    regionCode: me?.phoneNumber?.regionCode ?? undefined,
  },
})

export interface ContactInformationProps {
  me: ContactInformation_me
}

export const ContactInformation: React.FC<ContactInformationProps> = ({
  me,
}) => {
  const {
    router,
    match: {
      params: { id },
    },
  } = useRouter()

  const { openErrorModal } = useErrorModal()

  const { relayEnvironment, user, isLoggedIn } = useSystemContext()
  const {
    submission,
    saveSubmission,
    submissionId,
    removeSubmission,
  } = useSubmission(id)

  const handleRecaptcha = (action: RecaptchaAction) =>
    new Promise(resolve => recaptcha(action, resolve))

  const handleSubmit = async ({
    name,
    email,
    phone,
  }: ContactInformationFormModel) => {
    if (!(await handleRecaptcha("submission_submit"))) return

    if (submission) {
      const contactInformationForm = {
        name: name.trim(),
        email: email.trim(),
        phone: phone,
      }

      submission.contactInformationForm = contactInformationForm

      saveSubmission(submission)
    }

    if (relayEnvironment && submission) {
      try {
        await createConsignSubmission(
          relayEnvironment,
          submission,
          user?.id,
          !isLoggedIn ? getENV("SESSION_ID") : undefined
        )
        removeSubmission()
        router.push(`/consign/submission/${submissionId}/thank-you`)
      } catch (error) {
        console.log(error)
        openErrorModal()
      }
    }
  }

  return (
    <>
      <BackLink
        py={2}
        mb={6}
        width="min-content"
        to={`/consign/submission/${submissionId}/upload-photos`}
      >
        Back
      </BackLink>

      <SubmissionStepper currentStep="Contact Information" />

      <Text mt={4} variant="lg">
        Let us know how to reach you
      </Text>
      <Text mt={1} variant="md" color="black60">
        We will only use these details to contact you regarding your submission.
      </Text>

      <Formik<ContactInformationFormModel>
        initialValues={getContactInformationFormInitialValues(me)}
        validateOnMount
        onSubmit={handleSubmit}
        validationSchema={contactInformationValidationSchema}
      >
        {({ isValid, isSubmitting }) => {
          return (
            <Form>
              <ContactInformationForm my={6} me={me} />

              <Button
                data-test-id="save-button"
                width={["100%", "auto"]}
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                type="submit"
              >
                Submit Artwork
              </Button>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export const ContactInformationFragmentContainer = createFragmentContainer(
  ContactInformation,
  {
    me: graphql`
      fragment ContactInformation_me on Me {
        name
        email
        phone
        phoneNumber {
          isValid
          international: display(format: INTERNATIONAL)
          national: display(format: NATIONAL)
          regionCode
        }
      }
    `,
  }
)
