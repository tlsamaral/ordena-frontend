export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres que não sejam dígitos
  const cleaned = value.replace(/\D/g, '')

  // Aplica a máscara com base no comprimento do número
  if (cleaned.length <= 2) {
    return `(${cleaned}`
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }
}
