import { calculateShippingCost as calculateByShippingInfoObject } from './lib/shipping/shippingInfoAsObject'
import { cost, restrictions } from '../shop/database/shipping_rules.json'

export const calculateShippingCost = ({ country, cart }) => {
    if (cost || restrictions) {
        return calculateByShippingInfoObject({
            shippingInfo: { cost, restrictions },
            country,
            cart: cart.map(item => ({...item, quantity: 1}))
        })
    } else {
        return { shippingCost: 0 }
    }
}
