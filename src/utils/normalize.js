export function normalizePhone(value) {
  if (!value) {
    return value;
  }

  const onlyNum = value.replace(/[^\d]/g, '');
  if (onlyNum.length <= 3) {
    return onlyNum;
  }
  if (onlyNum.length <= 7) {
    return `(${onlyNum.slice(0, 3)}) ${onlyNum.slice(3)}`;
  }
  return `(${onlyNum.slice(0, 3)}) ${onlyNum.slice(3, 6)}-${onlyNum.slice(6, 10)}`;
}

export function numeric(value) {
  const onlyNum = value.replace(/[^\d]/g, '');

  if (!onlyNum) {
    return onlyNum;
  }

  return `${onlyNum}`;
}
