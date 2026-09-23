export const maskTelefone = (value: string) => {
  const digitos = value.replace(/\D/g, '').slice(0, 11)

  if (digitos.length <= 10) {
    return digitos
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return digitos
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export const isTelefoneValido = (value: string) => {
  const digitos = value.replace(/\D/g, '')
  return digitos.length === 10 || digitos.length === 11
}

export const maskCpf = (value: string) => {
  const digitos = value.replace(/\D/g, '').slice(0, 11)

  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const isCpfValido = (value: string) => {
  const cpf = value.replace(/\D/g, '')
  return cpf.length > 0
}
