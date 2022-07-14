import PopupWithoutForm from "./PopupWithoutForm";
import SuccessIcon from '../image/success.png';
import ErrorIcon from '../image/fail.png';

function RegistrationAnswer(props) {
  if (props.answer) {
    return (
      <PopupWithoutForm
        name='success'
        title='Вы успешно зарегистрировались!'
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <img src={SuccessIcon} className="popup__icon" />
      </PopupWithoutForm>
    )
  } else {
    return (
      <PopupWithoutForm
        name='error'
        title='Что-то пошло не так! Попробуйте ещё раз.'
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <img src={ErrorIcon} className="popup__icon" />
      </PopupWithoutForm>
    )
  }
  
}

export default RegistrationAnswer;