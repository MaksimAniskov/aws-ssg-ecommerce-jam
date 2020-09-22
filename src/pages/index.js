import React from "react"

import SEO from "../components/seo"
import { Center, Footer, Tag, Showcase, DisplaySmall, DisplayMedium } from '../components'
import CartLink from '../components/CartLink'
import { titleIfy, slugify } from '../../utils/helpers'
import { DENOMINATION } from '../../providers/shopSettingsProvider'

import { graphql } from 'gatsby'

const Home = ({ data: gqlData }) => {
  const {
    featuredItems: { data: featuredItems },
    storefrontItems: { data: storefrontItems },
    categoryInfo: { data: categories }
  } = gqlData

  return (
    <>
      <CartLink />
      <SEO title="Home" />
      {
        featuredItems
          .map((item, i) =>
            <div className="w-full" key={item.id}>
              <div className="bg-green-200
              lg:h-hero
              p-6 pb-10 smpb-6
              flex lg:flex-row flex-col">
                <div className="pt-4 pl-2 sm:pt-12 sm:pl-12 flex flex-col">
                  <Tag
                    year={item.categories.includes('new arrivals') ? new Date().getFullYear() : null}
                    category={item.categories[0]}
                  />
                  <Center
                    price={item.price}
                    currencySymbol={DENOMINATION}
                    title={item.name}
                    link={slugify(item.name)}
                  />
                  <Footer designer={item.brand} />
                </div>
                <div className="flex flex-1 justify-center items-center relative">
                  <Showcase
                    imageSrc={item.image+'_w612.webp'}
                  />
                  <div className="absolute
                    w-48 h-48 sm:w-72 sm:h-72 xl:w-88 xl:h-88
                    bg-white z-0 rounded-full" />
                </div>
              </div>
            </div>
          )
      }

      <div className="my-4 lg:my-8 flex flex-col lg:flex-row justify-between">
        {
          categories.map(category =>
            <DisplayMedium 
              key={category.name}
              imageSrc={category.image+'_w576.webp'}
              subtitle={`${category.itemCount} items`}
              title={titleIfy(category.name)}
              link={slugify(category.name)}
            />
          )
        }
      </div>
      <div className="my-4 lg:my-8 flex flex-col lg:flex-row justify-between">
      {
        storefrontItems
          .map(item =>
            <DisplaySmall
              key={item.id}
              imageSrc={item.image+'_w200.webp'}
              title={item.name}
              subtitle={item.categories[0]}
              link={slugify(item.name)}
            />
          )
      }
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query {
    categoryInfo {
      data {
        name
        image
        itemCount
      }
    }
    featuredItems {
      data {
        image
        name
        brand
        categories
        description
        id
        price
      }
    }
    storefrontItems {
      data {
        image
        name
        categories
        description
        id
        price
      }
    }
  }
`

export default Home
