export const reorderSameArrElem = (
  arr: any[],
  fromIndex: number,
  toIndex: number,
) => {
  const newArr = [...arr];
  newArr.splice(toIndex, 0, newArr.splice(fromIndex, 1)[0]);
  return newArr;
};

export const reorderArrElemToAnother = <T>(
  arr: T[],
  elem: T,
  toIndex: number,
) => {
  const newArr = [...arr];
  newArr.splice(toIndex, 0, elem);
  return newArr;
};
