const loginToken = {
  get current() {
    let object = null;
    let token = window.localStorage.getItem('UserLoginToken');
    if (token) object = JSON.parse(token);
    return object;
  },
  set current(object) {
    if (object != null) window.localStorage.setItem('UserLoginToken', JSON.stringify(object));
    else window.localStorage.removeItem('UserLoginToken');
  }
};

export default loginToken;
