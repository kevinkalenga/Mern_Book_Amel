export const addDecimal = (num) => {
    return (Math.round(num*100)/100).toFixed(2)
}


export const updateCart = (state) => {
    const itemsPrice = state.cartItems.reduce((acc, item) => acc + (item.price * item.qty)/100, 0)
    state.itemsPrice = addDecimal(itemsPrice)

    const shippingPrice = itemsPrice > 100 ? 0 : 10
    state.itemsPrice = addDecimal(shippingPrice)
    
    const taxPrice = 0.15 * itemsPrice
    state.taxPrice = addDecimal(taxPrice)

    const totalPrice = itemsPrice + shippingPrice + taxPrice
    state.totalPrice = addDecimal(totalPrice)

    localStorage.setItem("cart", JSON.stringify(state))

    return state
}