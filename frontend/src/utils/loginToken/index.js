const loginToken = {
  get current() {
    let object = null;
    let token = window.localStorage.getItem('snatchLoginToken');
    if (token) object = JSON.parse(token);
    return object;
  },
  set current(object) {
    if (object != null) window.localStorage.setItem('snatchLoginToken', JSON.stringify(object));
    else window.localStorage.removeItem('snatchLoginToken');
  }
};

export default loginToken;
