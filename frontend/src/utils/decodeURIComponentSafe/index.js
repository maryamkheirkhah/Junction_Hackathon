const decodeURIComponentSafe = (uri, mod) => {
  let out = new String(),
    arr,
    i = 0,
    l,
    x;

  arr = uri.split(/(%(?:d0|d1)%.{2})/);
  for (l = arr.length; i < l; i++) {
    try {
      x = decodeURIComponent(arr[i]);
    } catch (e) {
      x = mod ? arr[i].replace(/%(?!\d+)/g, 'perc') : arr[i];
    }
    out += x;
  }
  return out;
};

export default decodeURIComponentSafe;
