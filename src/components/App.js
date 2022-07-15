import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import registerApi from "../utils/RegisterApi";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import RegistrationAnswer from './RegistrationAnswer';
import { Route, Switch, withRouter } from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";


function App(props) {
  
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [isPopupWithoutFormOpen, setIsPopupWithoutFormOpen] = useState(false);
  const [pageData, setPageData] = useState({});
  const [popupSuccess, setPopupSuccess] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      api.getCards()
      .then(res => {
        setCards(res)
      })
      .catch((err) => {
        console.log(err)
      });
    }
    
  }, [loggedIn])

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.toggleLike(card._id, isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter(item => item._id !== card._id));
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handlePopupWithoutFormOpen(result) {
    setPopupSuccess(result);
    setIsPopupWithoutFormOpen(true);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard({});
  }

  useEffect(() => {
    if (loggedIn) {
      api.getUser()
      .then(res => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }, [loggedIn])

  function handleUpdateUser(data) {
    api.editProfile(data)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleUpdateAvatar(data) {
    api.changeAvatar(data)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err)
    })
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data)
    .then((res) => {
      setCards([res, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleRegisterUser(data) {
    registerApi.register(data)
    .then((res) => {
      handlePopupWithoutFormOpen(true);
      return res;
    })
    .catch((err) => {
      handlePopupWithoutFormOpen(false);
      console.log(err);
    })
  }

  function handleLoginUser(data) {
    registerApi.authorize(data)
    .then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        setLoggedIn(true);
        setPageData({
          'email': data.email,
        });
        setLoggedIn(true)
        props.history.push('/');
      } else {
        return;
      }
    })
    .catch((err) => {
      handlePopupWithoutFormOpen(false);
      console.log(err);
    })
  }

  function checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      registerApi.getContent(token)
      .then((data) => {
        if (data) {
          const userData = {
            'email': data.data.email,
          }
          setPageData(userData);
          setLoggedIn(true)
          props.history.push('/')
          
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  useEffect(() => {
    checkToken();
  }, [])

  function logout() {
    localStorage.setItem('token', '');
    setLoggedIn(false);
  }

  function closePopupWithoutForm() {
    setIsPopupWithoutFormOpen(false);
    props.history.push('/');
  }

  return (
    <CurrentUserContext.Provider value={currentUser} >
      <div className="page">
        <Switch>
          <ProtectedRoute exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={setSelectedCard}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            headerLinkName='Выйти'
            headerLinkUrl='/sign-in'
            onClick={logout}
            pageData={pageData.email}
          />
          <Route path="/sign-in">
            <Login onLoginUser={handleLoginUser} />
          </Route>
          <Route path="/sign-up">
            <Register onRegisterUser={handleRegisterUser} />
          </Route>
        </Switch>

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onSavePlace={handleAddPlaceSubmit}/>

        <RegistrationAnswer isOpen={isPopupWithoutFormOpen} onClose={closePopupWithoutForm} answer={popupSuccess} />

        <PopupWithForm
          name='delete'
          title='Вы уверены?'
          buttonName='Да'
        >
        </PopupWithForm>
        <ImagePopup
          name='image'
          card={selectedCard}
          onClose={closeAllPopups}
        />       
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
