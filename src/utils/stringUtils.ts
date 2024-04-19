export const isEmptyString = (value: string | undefined) => (value === undefined
  || value === null
  || value.trim().length === 0);
