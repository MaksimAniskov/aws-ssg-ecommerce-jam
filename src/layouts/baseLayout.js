/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Link } from "gatsby"
import { SiteContext, ContextProviderComponent } from '../context/mainContext'
import { titleIfy, slugify } from '../../utils/helpers'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify';
import { colors } from '../theme'

toast.configure( {
  progressStyle: {
    background: colors.primary,
  }
})

const logo = require('../images/logo.png');

class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <ContextProviderComponent>
        <SiteContext.Consumer>
        {
          context => {
            let { shopData: { navInfo: { data: links }, site: {siteMetadata}}} = context
    
            links = links.map(link => {
              const newLink = {}
              newLink.link = slugify(link)
              newLink.name = titleIfy(link)
              return newLink
            })
        
            links.unshift({ name: 'Home', link: '/'})
            return (
              <div className="min-h-screen">
                <nav>
                  <div className="flex justify-center">
                    <div className="
                    w-fw
                    mobile:px-10 desktop:px-0 px-4 pt-10 pb-6
                    flex flex-col
                    sm:flex-row">
                      <Link to="/">
                        <img className="mb-4 w-24 mw-24 sm:w-20 sm:mr-16" alt="Logo" src={logo} />
                      </Link>
                      <div className="flex flex-wrap">
                        {
                          links.map((l, i) => (
                            <Link to={l.link} key={i}>
                              <p key={i} className="text-left m-0 text-smaller mr-4 sm:mr-8 font-semibold">{l.name}</p>
                            </Link>
                          ))
                        }
                      </div>
                      {/* <div className="flex flex-1 justify-end pr-4 relative">
                        <Link to="/cart">
                          <FaShoppingCart />
                        </Link>
                        {
                          numberOfItemsInCart > Number(0) && (
                            <div>
                              <FaCircle />
                            </div>
                          )
                        }
                      </div> */}
                    </div>
                  </div>
                </nav>
                <div className="mobile:px-10 px-4 pb-10 flex justify-center">
                  <main className="w-fw">{children}</main>
                </div>
                <footer className="flex justify-center">
                  <div className="w-fw px-8 desktop:px-0 border-solid border-t border-gray-300 items-center text-gray-700 pt-4 pb-8 mt-2 text-xs">
                    <span className="block">
                      Copyright © {(new Date()).getFullYear()} {siteMetadata && siteMetadata.shopName ? siteMetadata.shopName+'.' : "Forgot to configure shop's name?"} All rights reserved.
                    </span>
                    {siteMetadata && siteMetadata.creditsHtml &&
                      <span className="block" dangerouslySetInnerHTML={{__html: siteMetadata.creditsHtml}}/>
                    }
                  </div>
                </footer>
              </div>
            )
          }
        }
        </SiteContext.Consumer>
      </ContextProviderComponent>
    )
  }
}

export default Layout
