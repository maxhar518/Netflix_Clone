import React, { useCallback, useState } from 'react';
import NetfuixLogo from '../components/svg/NetfuixLogo';
import Input from '../components/Input';
import axios from 'axios';
import { signIn } from 'next-auth/react';

import AuthFooter from '../components/AuthFooter';
import Link from 'next/link';
import DisclaimerModal from '../components/DisclaimerModal';
import SpinnerIcon from '../components/svg/SpinnerIcon';
import { useRouter } from 'next/router';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [variant, setVariant] = useState('login');
  const [loggingIn, setLoggingIn] = useState(false);

  const { error } = useRouter().query;

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant == 'login' ? 'register' : 'login'
    );
  }, []);

  const login = useCallback(async () => {
    setLoggingIn(true);
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/profile'
      });
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  const register = useCallback(async () => {
    setLoggingIn(true);
    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      });

      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, login]);

  return (
    <>
      <div className="relative h-auto w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className='bg-black w-full min-h-[calc(100vh_-_287px)] md:min-h-[calc(100vh_-_250.5px)] md:bg-opacity-50'>
          <nav className='px-4 md:px-12 py-5'>
            <Link href='/'>
              <NetfuixLogo classes='h-[2rem] md:w-[9.25rem] md:h-[2.5rem] text-red-netfuix block fill-current' />
            </Link>
          </nav>
          <div className='flex justify-center'>
            <div className='bg-black bg-opacity-75 px-4 md:px-16 py-8 md:py-16 self-center md:max-w-md rounded-[4px] w-full mb-10'>
              <h2 className='text-white text-4xl mb-8 font-bold'>
                {variant == 'login' ? 'Sign In' : 'Sign Up'}
              </h2>
              {error && (
                <p className='text-red-netfuix font-medium mb-2 -mt-3'>
                  {error}
                </p>
              )}
              <div className='flex flex-col gap-4'>
                {variant == 'register' && (
                  <Input
                    label='Username'
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setName(e.target.value)}
                    id='name'
                    value={name}
                  />
                )}
                <Input
                  label='Email or phone number'
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setEmail(e.target.value)}
                  id='email'
                  type='email'
                  value={email}
                />
                <Input
                  label='Password'
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setPassword(e.target.value)}
                  id='password'
                  type='password'
                  value={password}
                />
              </div>
              <button
                onClick={variant == 'login' ? login : register}
                className='bg-red-netfuix py-3 font-semibold text-white rounded-[4px] w-full mt-10 hover:bg-red-netfuix-dark transition'
              >
                {loggingIn && (
                  <div className='flex items-center justify-center'>
                    <SpinnerIcon classes='text-white' />
                    <p>Connecting...</p>
                  </div>
                )}
                {!loggingIn && variant == 'login' && 'Sign In'}
                {!loggingIn && variant != 'login' && 'Sign Up'}
              </button>


              <p className='text-neutral-500 mt-12'>
                {variant == 'login'
                  ? 'New to Netfuix?'
                  : 'Already have an account?'}
                <span
                  onClick={toggleVariant}
                  className='text-white font-medium ml-1 hover:underline cursor-pointer'
                >
                  {variant == 'login' ? 'Sign up now' : 'Sign in here'}
                </span>
                .
              </p>
            </div>
          </div>
        </div>
        <div className='bg-black md:bg-opacity-50'>
          <AuthFooter />
        </div>
      </div>
      <DisclaimerModal />
    </>
  );
};

export default Auth;
