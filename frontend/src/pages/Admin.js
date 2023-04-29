import React, { useEffect, useState, Component } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { adminPermission, userName, userPassword, users } from '../recoil_state';

function Admin() {

  const user = useRecoilValue(userName);
  const userState = useSetRecoilState(userName);

  const setUsers = useSetRecoilState(users);
  const loggedInUser = useRecoilValue(users);

  const usersAPI = 'http://localhost:8080/api/users?tokenId=1010&userId='+user;
        //const json = {"userName":"Arghya"};
        //setUsers(() => json);
          useEffect(() => {fetch(usersAPI)
            .then((res) => res.json())
            .then((data) => {setUsers(() => data[0]);console.log(data[0]);console.log(loggedInUser);});
          }, [setUsers]);

  //return <div>You are on admin site</div>;


  console.log(loggedInUser);
  
  return (
    
    <>
      
      <div><b>NFT Id:</b>{loggedInUser.nftId}</div>
      <div><b>NFT Symbol:</b>{loggedInUser.nftSymbol}</div>
      <div><b>Balance:</b>{loggedInUser.ticketId}</div>
      <div><b>NFT URI:</b>{loggedInUser.uri}</div>
      <div><b>NFT Holdings:</b>{loggedInUser.balance}</div>
      {console.log(new Array(loggedInUser.nft))}

      
      

    
      
    </>
  );
}



export default Admin;
