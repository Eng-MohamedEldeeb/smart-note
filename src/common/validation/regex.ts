export const validate = (regex: RegExp) => {
  return (v: string) => {
    return regex.test(v)
  }
}

export const phonePattern = new RegExp(/^01(0|1|2|5)\d{8}$/)

export const passwordPattern = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z]?)(?=.*[0-9]?)(?!.*!#$%&*()-+=\/\\\."';:|,<>\{\}\[\]).{3,16}$/,
)
