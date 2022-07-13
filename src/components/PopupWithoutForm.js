function PopupWithoutForm({name, title, isOpen, onClose, buttonName, children}){
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button className="popup__close-button" aria-label="Закрыть" onClick={onClose}></button>
        {children}
        <h2 className="popup__title">{title}</h2> 
      </div>
    </div>
  )
}

export default PopupWithoutForm;