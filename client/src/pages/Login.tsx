import React, { useState } from 'react'
import { Card, CardHeader } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.png'

const Login = () => {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [alert, setAlert] = useState('')
  const navigate = useNavigate()

  const verificalogin = () => {
    if (login === 'admin' && senha === 'admin') {
      navigate('/home')
    } else {
      setAlert('Login ou senha incorretos')
    }
  }

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#DFC4A4] to-[#cba377] p-4'>
      <Card className='bg-[#261810] border-none shadow-2xl rounded-2xl w-full max-w-md p-8 sm:p-10 flex flex-col gap-6'>
        <CardHeader className='  mb-2 items-center justify-center'>
        <img src={Logo} alt="" className='h-20 mx-auto' />
          <h1 className='text-[#DFC4A4] text-3xl font-bold text-center '>
            Bem-vindo
          </h1>
          <p className='text-gray-400 text-sm text-center mt-1'>
            Faça login para acessar sua conta
          </p>
        </CardHeader>

        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <label className='text-gray-200 text-sm font-medium tracking-wide ml-1'>
              Login
            </label>
            <Input
              onChange={(e) => setLogin(e.target.value)}
              value={login}
              placeholder='Digite seu usuário'
              className='bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#DFC4A4] h-12 rounded-xl'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-gray-200 text-sm font-medium tracking-wide ml-1'>
              Senha
            </label>
            <Input
              type='password'
              onChange={(e) => setSenha(e.target.value)}
              value={senha}
              placeholder='••••••••'
              className='bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#DFC4A4] h-12 rounded-xl'
            />
          </div>
        </div>

        <div className='min-h-[20px] text-center'>
          {alert && (
            <span className='text-red-400 text-sm font-medium animate-pulse'>
              {alert}
            </span>
          )}
        </div>

        <Button
          onClick={verificalogin}
          className='bg-[#DFC4A4] text-[#261810] hover:bg-[#ebd5bd] hover:scale-[1.02] transition-all duration-300 font-bold text-base w-full h-12 rounded-xl mt-2'
        >
          Entrar
        </Button>
      </Card>
    </div>
  )
}

export default Login