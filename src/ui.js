import {AuthErrorCodes } from 'firebase/auth'

export const emailTxt = document.getElementById('emailTxt');
export const passwordTxt = document.getElementById('passwordTxt');

export const logInBtn = document.getElementById('logInBtn');
export const signUpBtn = document.getElementById('signUpBtn');
export const logOutBtn = document.getElementById('logOutBtn');

export const lblLoginErrorMessage = document.getElementById('lblLoginErrorMessage');

export const openLogInModal = () => {
  document.getElementById('overlay').classList.add('active');
  document.getElementById('loginModal').classList.add('active');
  resetLogInModal();
}

export const closeLogInModal = () => {
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('loginModal').classList.remove('active')
  resetLogInModal();
}

export const resetLogInModal = () => {
  emailTxt.textContent = '';
  passwordTxt.textContent = '';
}

export const hideLoginError = () => {
  lblLoginErrorMessage.classList.remove('active')
}

export const showLoginError = (error) => {
  lblLoginErrorMessage.classList.add('active')  
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Invalid password. Try again.`
  } else if (error.code == AuthErrorCodes.NULL_USER) {
    lblLoginErrorMessage.innerHTML = `This user doesn't exist. Try again.`
  }  else if (error.code == AuthErrorCodes.INVALID_EMAIL) {
    lblLoginErrorMessage.innerHTML = `Invalid email address. Try again.`
  } else if (error.code == AuthErrorCodes.WEAK_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Password should be at least 6 characters. Try again.`
  } else if (error.code == AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE){
    lblLoginErrorMessage.innerHTML = `User credentials already taken. Try again.`
  }
  else {
    lblLoginErrorMessage.innerHTML = 'Try again!'     
  }
}

export const showLoginState = (user) => {
  document.getElementById('userGreeting').innerHTML = `Welcome ${user.email}!`;
  document.getElementById('userGreeting').classList.remove('inactive');
  document.getElementById('userGreeting').classList.add('active');

  document.getElementById('logOutBtn').classList.remove('inactive');
  document.getElementById('logOutBtn').classList.add('active');

  document.getElementById('openLogInModalBtn').classList.remove('active');
  document.getElementById('openLogInModalBtn').classList.add('inactive');
  resetLogInModal();
}

export const showLogOutState = () => {
  document.getElementById('userGreeting').classList.add('inactive');
  document.getElementById('userGreeting').classList.remove('active');

  document.getElementById('logOutBtn').classList.add('inactive');
  document.getElementById('logOutBtn').classList.remove('active');

  document.getElementById('openLogInModalBtn').classList.add('active');
  document.getElementById('openLogInModalBtn').classList.remove('inactive');
  resetLogInModal();
}
