function deepEqual(object1: { [key: string]: { value: string } }, object2: { [key: string]: { value: string } }) {
  const keys1: Array<string> = Object.keys(object1);
  const keys2: Array<string> = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let index = 0; index < keys1.length; index++) {
    const val1 = object1[keys1[index]];
    const val2 = object2[keys2[index]];
    if (val1 !== val2) {
      return false;
    }
  }

  return true;
}

export function arraydeepEqual(array1: any, array2: any) {
  if (array1.length !== array2.length) {
    return false;
  }
  // equal length
  for (let i = 0; i < array1.length; i++) {
    if (!deepEqual(array1[i], array2[i])) {
      return false;
    }
  }
  return true;

}