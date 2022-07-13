import PopupWithoutForm from "./PopupWithoutForm";

function RegistrationSuccess(props) {
  return (
    <PopupWithoutForm
      name='success'
      title='Вы успешно зарегистрировались'
      isOpen={props.isOpen}
      onClose={props.onClose}
    />
  )
}

export default RegistrationSuccess;