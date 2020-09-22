import React from 'react';
import { Button } from '../';
import { navigate } from "gatsby"

const Center = ({ currencySymbol, price, title, link }) => {
  function navigateTo() {
    navigate(link)
  }

  return (
    <div>
      <p className="text-4xl xl:text-5xl font-bold tracking-widest leading-none">{title}</p>
      <p>{currencySymbol}{price}</p>
      <Button
        onClick={navigateTo}
        title="Shop Now"
      />
    </div>
  )
}

export default Center