import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <header className="header-top-strip py-3">
        <div className="container-xxl mx-auto">
          <div className="flex justify-between items-center">
            <div className='flex-1 mb-0'>
              <p className='text-white'>Free Shipping Over ₹2000 & Free Returns</p>
            </div>
            <div className="ml-auto">
              <p className="text-white mb-0">
                Hotline: <a className="text-white" href="tel:+91 8879025972">+91 8879025972</a>
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header