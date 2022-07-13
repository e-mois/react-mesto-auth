import { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AuthForm from './AuthForm';
import RegistrationSuccess from './RegistrationSuccess';

function Register(props) {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  function handleChangeEmail(event) {
    setEmail(event.target.value)
  }

  function handleChangePass(event) {
    setPass(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onRegisterUser({
      email,
      password: pass,
    });
    props.onSuccess();
  }

  function closeSuccessPopup() {
    props.onClose();
    props.history.push('/sign-in');
  }

  return (
    <>
    <AuthForm
      name='login'
      title='Регистрация'
      buttonName='Зарегистрировать'
      headerLinkName='Войти'
      headerLinkUrl='/sign-in'
      onSubmit={handleSubmit}
    >
      <label htmlFor="input-email" className="popup__label">
        <input 
          type="text" 
          id="input-email" 
          className="auth__input" 
          placeholder="Email" 
          required 
          minLength="2" 
          maxLength="30" 
          name="email" 
          onChange={handleChangeEmail}
          value={email}
        />
        <span className="input-email-error popup__input-error"></span>
      </label>
      <label htmlFor="input-pass" className="popup__label">
        <input 
          type="password" 
          id="input-pass" 
          className="auth__input" 
          placeholder="Пароль" 
          required 
          name="pass" 
          onChange={handleChangePass}
          value={pass}
        />
        <span className="input-pass-error popup__input-error"></span>
      </label>
    </AuthForm>
    
    <p className='auth__note'>Уже зарегистрированы? <Link to='/sign-in'>Войти</Link></p>
    <RegistrationSuccess
      isOpen={props.isOpen}
      onClose={closeSuccessPopup}
    />
    </>
  )
}

export default withRouter(Register);
