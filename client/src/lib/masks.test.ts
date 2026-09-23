import { describe, expect, it } from 'vitest'
import { isCpfValido, isTelefoneValido, maskCpf, maskTelefone } from './masks'

describe('maskCpf', () => {
  it('formata os dígitos progressivamente enquanto o usuário digita', () => {
    expect(maskCpf('5')).toBe('5')
    expect(maskCpf('529')).toBe('529')
    expect(maskCpf('5299822')).toBe('529.982.2')
    expect(maskCpf('52998224725')).toBe('529.982.247-25')
  })

  it('ignora letras e outros caracteres não numéricos', () => {
    expect(maskCpf('abc529.982a247-25xyz')).toBe('529.982.247-25')
  })

  it('limita a 11 dígitos', () => {
    expect(maskCpf('529982247259999')).toBe('529.982.247-25')
  })
})

describe('isCpfValido', () => {
  it('aceita qualquer sequência de dígitos, sem checar dígito verificador', () => {
    expect(isCpfValido('529.982.247-25')).toBe(true)
    expect(isCpfValido('52998224725')).toBe(true)
    expect(isCpfValido('529.982.247-26')).toBe(true)
    expect(isCpfValido('111.111.111-11')).toBe(true)
    expect(isCpfValido('123')).toBe(true)
  })

  it('rejeita apenas quando não há nenhum dígito', () => {
    expect(isCpfValido('')).toBe(false)
    expect(isCpfValido('abc.def.ghi-jk')).toBe(false)
  })
})

describe('maskTelefone', () => {
  it('formata celular com 9 dígitos', () => {
    expect(maskTelefone('11987654321')).toBe('(11) 98765-4321')
  })

  it('formata telefone fixo com 8 dígitos', () => {
    expect(maskTelefone('1133334444')).toBe('(11) 3333-4444')
  })

  it('ignora letras digitadas junto com os números', () => {
    expect(maskTelefone('(11) abc98765-4321')).toBe('(11) 98765-4321')
  })

  it('limita a 11 dígitos', () => {
    expect(maskTelefone('119876543219999')).toBe('(11) 98765-4321')
  })
})

describe('isTelefoneValido', () => {
  it('aceita 10 ou 11 dígitos', () => {
    expect(isTelefoneValido('(11) 3333-4444')).toBe(true)
    expect(isTelefoneValido('(11) 98765-4321')).toBe(true)
  })

  it('rejeita quantidade errada de dígitos', () => {
    expect(isTelefoneValido('(11) 333-444')).toBe(false)
    expect(isTelefoneValido('')).toBe(false)
    expect(isTelefoneValido('abcdefghij')).toBe(false)
  })
})
