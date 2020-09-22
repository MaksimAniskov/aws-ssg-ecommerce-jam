import React, { useState } from "react"
import { CountryDropdown } from 'react-country-region-selector';

import { SiteContext, ContextProviderComponent } from "../context/mainContext"
import { calculateShippingCost } from "../../providers/shippingCostProvider"
import { FaLongArrowAltLeft } from "react-icons/fa"
import { Link } from "gatsby"
import Image from "../components/Image"
import { backendUrl } from "../../settings.json"

import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { DENOMINATION, stripe } from '../../providers/shopSettingsProvider'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
let stripePromise
if (stripe && stripe.publicKey) {
  stripePromise = loadStripe(stripe.publicKey)
}

const Error = ({ message }) =>  (
  <div className="ml-4 mt-4">
    {message}
  </div>
)

function CheckoutWithContext(props) {
  return (
    <ContextProviderComponent>
      <SiteContext.Consumer>
        {context => (
          stripe && stripe.publicKey ? (
              <Elements stripe={stripePromise}>
                <Checkout {...props} context={context} />
              </Elements>
            ) : (
              <div className="ml-4 mt-4">
                {<Error message="Stripe is not configured"/>}
               </div>
            )
        )}
      </SiteContext.Consumer>
    </ContextProviderComponent>
  )
}

const Input = ({ onChange, value, name, placeholder }) => (
  <input
    onChange={onChange}
    value={value}
    className="mt-2 text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    type="text"
    placeholder={placeholder}
    name={name}
  />
)

const Checkout = ({ context }) => {
  const [inProgress, setInProgress] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [input, setInput] = useState({
    name: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    postal_code: "",
    country: "",
    state: "",
  })
  const [shippingCost, setShippingCost] = useState(0)

  const stripe = useStripe()
  const elements = useElements()

  const onChange = e => {
    setErrorMessage(null)
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const { name, email, line1, line2, city, postal_code, country, state } = input
    const { cart, total, clearCart } = context

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Validate input
    if (!line1 || !city || !postal_code || !country) {
      setErrorMessage("Please fill in the form!")
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    const address = {
      city,
      line1,
      line2,
      postal_code,
      country,
      state
    }

    let stripeClientSecret, error;

    const orderItems = Array.from(cart.map(({name, price}) => ({sku: name, price, quantity: 0})));
    cart.forEach(cartItem => orderItems.find(orderItem => orderItem.sku === cartItem.name).quantity++);

    setInProgress(true)

    const resp = await fetch(
      `${backendUrl}/paymentintent`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          total: total,
          items: orderItems.filter(i => i.quantity),
          country: address.country,
          shippingCost
        })
      }
    );

    ({stripeClientSecret, error} = await resp.json())

    if (error) {
      setInProgress(false)
      setErrorMessage(error.message)
      return
    }

    ({ error } = await stripe.confirmCardPayment(
      stripeClientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            address
          }
        },
        shipping: {
          name,
          address
        },
        receipt_email: email
      }
    ))

    if (error) {
      setInProgress(false)
      setErrorMessage(error.message)
      return
    }

    setInProgress(false)
    setOrderCompleted(true)
    clearCart()
  }

  const { numberOfItemsInCart, cart, total } = context
  const cartEmpty = numberOfItemsInCart === Number(0)

  if (orderCompleted) {
    return (
      <div>
        <h3>Thanks! Your order has been successfully processed.</h3>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pb-10">
      <div
        className="
            flex flex-col w-full
            c_large:w-c_large
          "
      >
        <div className="pt-10 pb-8">
          <h1 className="text-5xl font-light">Checkout</h1>
          <Link to="/cart">
            <div className="cursor-pointer flex">
              <FaLongArrowAltLeft className="mr-2 text-gray-600 mt-1" />
              <p className="text-gray-600 text-sm">Edit Cart</p>
            </div>
          </Link>
        </div>

        {cartEmpty ? (
          <h3>No items in cart.</h3>
        ) : (
          <div className="flex flex-col">
            <div className="">
              {cart.map((item, index) => {
                return (
                  <div className="border-b py-10" key={index}>
                    <div className="flex items-center">
                      <Image
                        className="w-32 m-0"
                        src={item.image+'_w200.webp'}
                        alt={item.name}
                      />
                      <p className="m-0 pl-10 text-gray-600 text-sm">
                        {item.name}
                      </p>
                      <div className="flex flex-1 justify-end">
                        <p className="m-0 pl-10 text-gray-900 tracking-tighter font-semibold">
                          {DENOMINATION + item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-1 flex-col md:flex-row">
              <div className="flex flex-1 pt-8 flex-col">
                <div className="mt-4 border-t pt-10">
                  <form onSubmit={handleSubmit}>
                    <Input
                      onChange={onChange}
                      value={input.name}
                      name="name"
                      placeholder="Cardholder name"
                    />
                    <CardElement className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    <Input
                      onChange={onChange}
                      value={input.email}
                      name="email"
                      placeholder="Email"
                    />
                    <Input
                      onChange={onChange}
                      value={input.line1}
                      name="line1"
                      placeholder="Address Line 1"
                    />
                    <Input
                      onChange={onChange}
                      value={input.line2}
                      name="line2"
                      placeholder="Address Line 2 (optional)"
                    />
                    <Input
                      onChange={onChange}
                      value={input.city}
                      name="city"
                      placeholder="City"
                    />
                    <CountryDropdown
                      onChange={(country) => {
                        setErrorMessage(null)
                        setInput({ ...input, country })
                        const {error, shippingCost} = calculateShippingCost({country, cart})
                        if (error) {
                          setErrorMessage(error.message)
                          setShippingCost(0)
                        } else {
                          setShippingCost(shippingCost)
                        }
                      }}
                      value={input.country}
                      valueType="short"
                      name="country"
                      placeholder="Country"
                      className="mt-2 text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <Input
                      onChange={onChange}
                      value={input.state}
                      name="state"
                      placeholder="State (optional)"
                    />
                    <Input
                      onChange={onChange}
                      value={input.postal_code}
                      name="postal_code"
                      placeholder="Postal Code"
                    />
                  </form>
                </div>
              </div>
              <div className="md:pt-20">
                <div className="ml-4 pl-2 flex flex-1 justify-end pt-2 md:pt-8 pr-4">
                  <p className="text-sm pr-10">Subtotal</p>
                  <p className="tracking-tighter w-38 flex justify-end">
                    {DENOMINATION + total}
                  </p>
                </div>
                <div className="ml-4 pl-2 flex flex-1 justify-end pr-4">
                  <p className="text-sm pr-10">Shipping</p>
                  <p className="tracking-tighter w-38 flex justify-end">
                    {DENOMINATION + shippingCost}
                  </p>
                </div>
                <div className="ml-4 pl-2 flex flex-1 justify-end bg-gray-200 pr-4 pt-6">
                  <p className="text-sm pr-10">Total</p>
                  <p className="font-semibold tracking-tighter w-38 flex justify-end">
                    {DENOMINATION + (total + shippingCost)}
                  </p>
                </div>
                {errorMessage && <Error message={errorMessage}/>}
                <button
                  type="submit"
                  disabled={!stripe || inProgress || errorMessage}
                  onClick={handleSubmit}
                  className={`${(!stripe || errorMessage) ? "bg-light " : "bg-secondary hover:bg-black "} text-white font-bold py-2 px-4 ml-4 mt-4 rounded focus:outline-none focus:shadow-outline`}
                >
                  {inProgress && 
                    <span style={{display: 'inline-block', marginRight: '3px'}} className="animate-spin">↻</span>
                  }
                  Confirm order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutWithContext
