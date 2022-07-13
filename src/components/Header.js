import { Link } from 'react-router-dom';
import logo from '../image/logo.svg';

function Header({ buttonName, headerLink }) {
  return (
    <header className="header">
      <img src={logo} alt="Лого" className="header__logo" />
      <Link className='header__link' to={headerLink}>{buttonName}</Link>
    </header>
  )
}

export default Header;