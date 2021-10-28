import { PaymentPicker_me } from "v2/__generated__/PaymentPicker_me.graphql"
import { PaymentPicker_order } from "v2/__generated__/PaymentPicker_order.graphql"
import { PaymentPickerCreateCreditCardMutation } from "v2/__generated__/PaymentPickerCreateCreditCardMutation.graphql"
import {
  Address,
  AddressErrors,
  AddressForm,
  AddressTouched,
  emptyAddress,
} from "v2/Components/AddressForm"

import { CreditCardInput } from "v2/Apps/Order/Components/CreditCardInput"
import { track } from "v2/System/Analytics"
import * as Schema from "v2/System/Analytics/Schema"
import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import type {
  StripeError,
  CreateTokenCardData,
  StripeElements,
  Stripe,
} from "@stripe/stripe-js"
import { CardElement } from "@stripe/react-stripe-js"

import {
  BorderedRadio,
  Checkbox,
  Collapse,
  Flex,
  Link,
  RadioGroup,
  Text,
  Spacer,
} from "@artsy/palette"
import { CommitMutation } from "v2/Apps/Order/Utils/commitMutation"
import { CreditCardDetails } from "./CreditCardDetails"
import {
  SystemContextConsumer,
  SystemContextProps,
} from "v2/System/SystemContext"
import { createStripeWrapper } from "v2/Utils/createStripeWrapper"
import { isNull, mergeWith } from "lodash"
import { BillingInfoFormContext } from "v2/Apps/Auction/Components/Form"
import { Form } from "formik"

export interface StripeProps {
  stripe: Stripe
  elements: StripeElements
}

export interface PaymentPickerProps {
  order: PaymentPicker_order
  me: PaymentPicker_me
  commitMutation: CommitMutation
  innerRef: React.RefObject<PaymentPicker>
}

interface BillingAddressFormShape {
  handleSubmit: () => Promise<void>
  handleReset: () => Promise<void>
  values: {
    address: Address
  }
  isValid: boolean
}

interface PaymentPickerState {
  hideBillingAddress: boolean
  address: Address
  addressErrors: AddressErrors
  addressTouched: AddressTouched
  stripeError: StripeError
  isCreatingStripeToken: boolean
  creditCardSelection: { type: "existing"; id: string } | { type: "new" }
  saveNewCreditCard: boolean
  formRef: React.RefObject<BillingAddressFormShape>
}

export type CreditCardIdResult =
  | { type: "error"; error: string | undefined }
  | { type: "internal_error"; error: string | undefined }
  | { type: "invalid_form" }
  | { type: "success"; creditCardId: string }

export class PaymentPicker extends React.Component<
  PaymentPickerProps & SystemContextProps & StripeProps,
  PaymentPickerState
> {
  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
  state = {
    hideBillingAddress: true,
    stripeError: null,
    isCreatingStripeToken: false,
    creditCardSelection: this.getInitialCreditCardSelection(),
    saveNewCreditCard: true,
    formRef: React.createRef<BillingAddressFormShape>(),
  }

  private getInitialCreditCardSelection(): PaymentPickerState["creditCardSelection"] {
    if (this.props.order.creditCard) {
      return {
        type: "existing",
        id: this.props.order.creditCard.internalID,
      }
    } else {
      return this.props.me.creditCards?.edges?.length
        ? {
            type: "existing",
            id: this.props.me.creditCards.edges[0]?.node?.internalID!,
          }
        : { type: "new" }
    }
  }

  private createStripeToken = async () => {
    try {
      this.setState({ isCreatingStripeToken: true })
      const stripeBillingAddress = this.getStripeBillingAddress()
      const element = this.props.elements.getElement(CardElement)!
      return await this.props.stripe.createToken(element, stripeBillingAddress)
    } finally {
      this.setState({ isCreatingStripeToken: false })
    }
  }

  getCreditCardId: () => Promise<
    | { type: "error"; error: string | undefined }
    | { type: "internal_error"; error: string | undefined }
    | { type: "invalid_form" }
    | { type: "success"; creditCardId: string }
  > = async () => {
    const { creditCardSelection, saveNewCreditCard, formRef } = this.state
    if (creditCardSelection.type === "existing") {
      return { type: "success", creditCardId: creditCardSelection.id }
    }

    if (this.needsAddress()) {
      formRef.current?.handleSubmit()
      if (!formRef.current?.isValid) {
        return { type: "invalid_form" }
      }
    }

    const stripeResult = await this.createStripeToken()
    if (stripeResult.error) {
      this.setState({
        stripeError: stripeResult.error,
      })
      return { type: "invalid_form" }
    }

    const creditCardOrError = (
      await this.createCreditCard({
        input: {
          token: stripeResult?.token?.id!,
          oneTimeUse: !saveNewCreditCard,
        },
      })
    ).createCreditCard?.creditCardOrError

    if (
      creditCardOrError?.mutationError &&
      creditCardOrError.mutationError.detail
    ) {
      return {
        type: "error",
        error: creditCardOrError.mutationError.detail,
      }
    } else if (
      creditCardOrError?.mutationError &&
      creditCardOrError.mutationError.message
    ) {
      return {
        type: "internal_error",
        error: creditCardOrError.mutationError.message,
      }
    } else {
      return {
        type: "success",
        creditCardId: creditCardOrError?.creditCard?.internalID!,
      }
    }
  }

  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
  @track((props: PaymentPickerProps, state, args) => {
    const showBillingAddress = !args[0]
    if (showBillingAddress && props.order.state === "PENDING") {
      return {
        action_type: Schema.ActionType.Click,
        subject: Schema.Subject.BNMOUseShippingAddress,
        flow: "buy now",
        type: "checkbox",
      }
    }
  })
  private handleChangeHideBillingAddress(hideBillingAddress: boolean) {
    if (!hideBillingAddress) {
      this.state.formRef.current?.handleReset()
    }

    this.setState({ hideBillingAddress })
  }

  render() {
    const { creditCardSelection, hideBillingAddress } = this.state
    const {
      me: { creditCards },
      isEigen,
    } = this.props
    const orderCard = this.props.order.creditCard

    const creditCardsArray = creditCards?.edges?.map(e => e?.node)!

    // only add the unsaved card to the cards array if it exists and is not already there
    if (
      orderCard != null &&
      !creditCardsArray.some(card => card?.internalID === orderCard.internalID)
    ) {
      creditCardsArray.unshift(orderCard)
    }

    const userHasExistingCards = creditCardsArray.length > 0

    return (
      <>
        {userHasExistingCards && (
          <>
            <RadioGroup
              onSelect={val => {
                if (val === "new") {
                  this.setState({ creditCardSelection: { type: "new" } })
                } else {
                  this.setState({
                    creditCardSelection: { type: "existing", id: val },
                  })
                }
              }}
              defaultValue={
                creditCardSelection.type === "new"
                  ? "new"
                  : creditCardSelection.id
              }
            >
              {creditCardsArray
                .map(e => {
                  // @ts-expect-error PLEASE_FIX_ME_STRICT_NULL_CHECK_MIGRATION
                  const { internalID, ...creditCardProps } = e
                  return (
                    <BorderedRadio value={internalID} key={internalID}>
                      <CreditCardDetails
                        responsive={false}
                        {...creditCardProps}
                      />
                    </BorderedRadio>
                  )
                })
                .concat([
                  <BorderedRadio
                    data-test="AddNewCard"
                    value="new"
                    key="new"
                    selected={creditCardSelection.type === "new"}
                  >
                    Add another card.
                  </BorderedRadio>,
                ])}
            </RadioGroup>
            <Spacer mb={1} />
            {!isEigen && (
              <Text variant="xs">
                <Link href="/user/payments" target="_blank">
                  Manage cards
                </Link>
              </Text>
            )}
          </>
        )}

        <Collapse open={this.state.creditCardSelection.type === "new"}>
          {userHasExistingCards && <Spacer mb={2} />}
          <BillingInfoFormContext
            ref={this.state.formRef}
            formKeys={["address"]}
            onSubmit={() => {}}
          >
            {() => (
              <Form>
                <Flex flexDirection="column">
                  <Text mb={1} size="md" color="black100" lineHeight="1.1em">
                    Credit card
                  </Text>
                  <CreditCardInput
                    onChange={response => {
                      this.setState({ stripeError: response.error! })
                    }}
                  />

                  {!this.isPickup() && (
                    <>
                      <Spacer mb={2} />
                      <Checkbox
                        selected={hideBillingAddress}
                        onSelect={this.handleChangeHideBillingAddress.bind(
                          this
                        )}
                        data-test="BillingAndShippingAreTheSame"
                      >
                        Billing and shipping addresses are the same.
                      </Checkbox>
                    </>
                  )}
                  <Collapse open={this.needsAddress()}>
                    <Spacer mb={2} />
                    <AddressForm billing={true} showPhoneNumberInput={false} />
                    <Spacer mb={2} />
                  </Collapse>
                  <Spacer mb={1} />
                  <Checkbox
                    data-test="SaveNewCreditCard"
                    selected={this.state.saveNewCreditCard}
                    onSelect={() =>
                      this.setState({
                        saveNewCreditCard: !this.state.saveNewCreditCard,
                      })
                    }
                  >
                    Save credit card for later use.
                  </Checkbox>
                </Flex>
              </Form>
            )}
          </BillingInfoFormContext>
        </Collapse>
      </>
    )
  }

  private getStripeBillingAddress(): CreateTokenCardData {
    // replace null items in requestedFulfillment with empty string to keep stripe happy
    const shippingAddress = mergeWith(
      {},
      emptyAddress,
      this.props.order.requestedFulfillment,
      (o, s) => (isNull(s) ? o : s)
    )
    const selectedBillingAddress = (this.needsAddress()
      ? this.state.formRef.current?.values?.address
      : shippingAddress) as Address
    const {
      name,
      addressLine1,
      addressLine2,
      city,
      region,
      postalCode,
      country,
    } = selectedBillingAddress
    return {
      name,
      address_line1: addressLine1,
      address_line2: addressLine2,
      address_city: city,
      address_state: region,
      address_zip: postalCode,
      address_country: country,
    }
  }

  private createCreditCard(
    variables: PaymentPickerCreateCreditCardMutation["variables"]
  ) {
    return this.props.commitMutation<PaymentPickerCreateCreditCardMutation>({
      variables,
      mutation: graphql`
        mutation PaymentPickerCreateCreditCardMutation(
          $input: CreditCardInput!
        ) {
          createCreditCard(input: $input) {
            creditCardOrError {
              ... on CreditCardMutationSuccess {
                creditCard {
                  internalID
                  name
                  street1
                  street2
                  city
                  state
                  country
                  postalCode
                  expirationMonth
                  expirationYear
                  lastDigits
                  brand
                }
              }
              ... on CreditCardMutationFailure {
                mutationError {
                  type
                  message
                  detail
                }
              }
            }
          }
        }
      `,
    })
  }

  private isPickup = () => {
    return (
      this.props.order.requestedFulfillment?.__typename === "CommercePickup"
    )
  }

  private needsAddress = () => {
    return this.isPickup() || !this.state.hideBillingAddress
  }
}

// Our mess of HOC wrappers is not amenable to ref forwarding, so to expose a
// ref to the PaymentPicker instance (for getCreditCardId) we'll add an
// `innerRef` prop which gets sneakily injected here
const PaymentPickerWithInnerRef: React.FC<
  PaymentPickerProps & {
    innerRef: React.RefObject<PaymentPicker>
  }
> = ({ innerRef, ...props }) => (
  <SystemContextConsumer>
    {({ isEigen }) => {
      return (
        <PaymentPicker ref={innerRef} isEigen={isEigen} {...(props as any)} />
      )
    }}
  </SystemContextConsumer>
)

export const PaymentPickerFragmentContainer = createFragmentContainer(
  track()(
    createStripeWrapper(PaymentPickerWithInnerRef)
  ) as typeof PaymentPickerWithInnerRef,
  {
    me: graphql`
      fragment PaymentPicker_me on Me {
        creditCards(first: 100) {
          edges {
            node {
              internalID
              brand
              lastDigits
              expirationMonth
              expirationYear
            }
          }
        }
      }
    `,
    order: graphql`
      fragment PaymentPicker_order on CommerceOrder {
        internalID
        mode
        state
        creditCard {
          internalID
          name
          street1
          street2
          city
          state
          country
          postalCode
          expirationMonth
          expirationYear
          lastDigits
          brand
        }
        requestedFulfillment {
          __typename
          ... on CommerceShip {
            name
            addressLine1
            addressLine2
            city
            region
            country
            postalCode
          }
          ... on CommercePickup {
            fulfillmentType
          }
        }
        lineItems {
          edges {
            node {
              artwork {
                slug
              }
            }
          }
        }
      }
    `,
  }
)
