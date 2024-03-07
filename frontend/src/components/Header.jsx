import React from 'react'
import { NavLink, Link } from "react-router-dom"

const Header = () => {
  return (
    <header className='header-top-strip py-3'>
      <div className="container-xxl">
        <div className="row">
          <div className='col-6'>
            <p>Free Shipping Over Rs2000 & Free Returns</p>
          </div>
          <div className='col-6'>
            <p>Hotline: <a href="tel:+91 8879025972">+91 8879025972</a> </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header