import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { adminPermission, userName, userPassword } from '../recoil_state';
import Admin from './Admin';
import Login from './Login';
import '../styles/AdminPage.css';

function AdminPage() {
  const permission = useRecoilValue(adminPermission);
  const user = useRecoilValue(userName);
  const password = useRecoilValue(userPassword);
  const permissionState = useSetRecoilState(adminPermission);
  const userState = useSetRecoilState(userName);
  const passwordState = useSetRecoilState(userPassword);

  const changePermission = () => {
    if (permission === false) {
      if (user === 'admin' && password === 'admin') {
        permissionState(() => true);
        userState(() => '');
        passwordState(() => '');
      } else {
        alert(`Invalid login or password. Look, you're on ADMIN site ;)`);
      }
    } else if (permission === true) {
      permissionState(() => false);
    }
  };
  return (
    <div className='admin_wrapper'>
      <button onClick={changePermission} className='admin_button'>
        {permission ? 'Log Out' : 'Log in'}
      </button>

      {permission ? <Admin /> : <Login />}
    </div>
  );
}

export default AdminPage;
