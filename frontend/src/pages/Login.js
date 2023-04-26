import React from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userPassword, userName } from '../recoil_state';
import '../styles/Login.css';

function Login() {
  const user = useSetRecoilState(userName);
  const password = useSetRecoilState(userPassword);
  const userValue = useRecoilValue(userName);
  const passwordValue = useRecoilValue(userPassword);

  const handleUser = (e) => {
    let value = e.target.value;
    user(() => value);
  };
  const handlePassword = (e) => {
    let value = e.target.value;
    password(() => value);
  };

  return (
    <>
      <form className='login_form'>
        <label htmlFor='login' className='form_label'>
          Type your login:
          <input
            onChange={handleUser}
            value={userValue}
            type='text'
            name='text'
            id='text'
            className='form_input'
          />
        </label>
        <label htmlFor='password' className='form_label'>
          Type your password:
          <input
            onChange={handlePassword}
            value={passwordValue}
            type='password'
            name='password'
            id='password'
            className='form_input'
          />
        </label>
      </form>
    </>
  );
}

export default Login;
