import React, { Component } from 'react'
import { Link } from 'react-router-dom';

const headerStyle = {
  background: '#ccebff',
  color: '#000',
  textAlign: 'right',
  padding: '2px'

}

const linkStyle = {
  color: '#000',
  textDecoration: 'none'

}

const titleStyle = {
  textAlign: 'left'
}

class Header extends Component {
  render() {
    return (
      <header style={headerStyle}>
        <h1 style={titleStyle}>Flight Insurance for Belongings</h1>
        <Link style={linkStyle} to="/">Home</Link> &nbsp;
        <Link style={linkStyle} to="/admin">Admin</Link>
      </header>
    )
  }
}

export default Header;