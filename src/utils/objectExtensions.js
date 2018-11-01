Object.byString = (obj, propPath) => {
  if (!propPath) {
    return null;
  }
  let val = obj;
  let path = propPath.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, ''); // strip a leading dot
  path
    .split('.')
    .forEach((p) => {
      val = val[p];
    });
  return val;
};
