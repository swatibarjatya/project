import React, {Component} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { adminPermission, userName, userPassword, users } from '../recoil_state';
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

  const setUsers = useSetRecoilState(users);
  const loggedInUser = useRecoilValue(users);

  var heading = ['nftId', 'nftSymbol', 'ticketId', 'uri'];
  var body = [];
  var res;

  const changePermission = () => {
    if (permission === false) {
      if ((user === 'producer' || user === 'investor' || user === 'pvr' || user === 'client') && password === 'admin') {
        permissionState(() => true);
        //userState(() => '');
        //passwordState(() => '');

        const usersAPI = 'http://localhost:8080/api/users?userId='+user;
        //const json = {"userName":"Arghya"};
        //setUsers(() => json);
          fetch(usersAPI)
            .then((res) => res.json())
            .then((data) => {
              setUsers(() => data[0]);
              res = data;
              body = data[0].nft;
              console.log(data[0]);
              console.log(body);
            });
          
  
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
    
    <div>
      <br /><br /><br />
      {permission ? <Admin /> : <Login />}
      <br /><br />
      

    </div>
    </div>
  );
}



export default AdminPage;
