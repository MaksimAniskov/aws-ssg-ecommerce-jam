import uuid from 'uuid/v4'
import { readFileSync } from 'fs'

/*
Inventory items must adhere to the following schema:

type ShippingCostCategory {
  category: String!
}

type ExplicitShippingCosts {
  cost: ShippingCosts!
}

type ShippingCosts {
  byCountry:
    US: Int // ISO 3166 2-letter (alpha-2) country code https://datahub.io/core/country-codes
    DE: Int
    SI: Int
    ...
  byContinent:
    NA: Int // 2-letter continent code https://datahub.io/core/continent-codes
    EU: Int
    ...
  default: Int
}

union ShippingRule = ShippingCostCategory | ExplicitShippingCosts

type Product {
  id: ID!
  categories: [String]!
  price: Float!
  name: String!
  image: String!
  description: String!
  currentInventory: Int!
  brand: String
  shipping: ShippingCost
}

*/

let inventory

export default function getInventory() {
  if (!inventory) {
    inventory = JSON.parse(readFileSync('./shop/database/inventory.json'))
  }
  return inventory.map(i => {
    i.id = uuid()
    return i
  })
}
