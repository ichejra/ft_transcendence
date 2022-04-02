import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  fetchAllUsers,
  fetchUserFriends,
  fetchNoRelationUsers,
  setIsPending,
  setIsFriend,
} from '../features/userProfileSlice';
import {
  fetchPendingStatus,
  fetchBlockedUsers,
} from '../features/friendsManagmentSlice';
import { updateGlobalState } from '../features/globalSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Cookies from 'js-cookie';
import { User } from '../features/userProfileSlice';
import swal from 'sweetalert';
import { useNavigate } from 'react-router';

import { useLocation } from 'react-router';

export const socket = io('http://localhost:3001', {
  auth: {
    token: Cookies.get('accessToken'),
  },
});

const SocketProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector((state) => state.globalState);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    socket.on('receive_notification', () => {
      dispatch(updateGlobalState());
      console.log('trigger the refresh');
    });

    return () => {
      socket.off('receive_notification');
    };
  }, [socket]);

  useEffect(() => {
    if (Cookies.get('accessToken')) {
      console.log('General Render');
      dispatch(fetchAllUsers());
      dispatch(fetchNoRelationUsers()).then(() => {
        dispatch(fetchPendingStatus());
        if (pathname.includes('profile')) {
          dispatch(fetchUserFriends());
        }
        dispatch(fetchBlockedUsers());
      });
      if (pathname.includes('profile')) {
        dispatch(setIsPending(false));
      }
      console.log('--------------------> refershhhhhh');
    }
  }, [refresh]);

  useEffect(() => {
    socket.on('game_invitation', ({ inviter, challengeId }) => {
      console.log('invit recieved from ', inviter.display_name);
      // swal('Good job!', 'You clicked the button!', 'success');
      swal(`You have been invited to a game by ${inviter.display_name}.`).then(
        (value) => {
          // swal(`The returned value is: ${value}`);
          if (value) {
            console.log(`The returned value is: ${value}`);
            socket.emit('accept_challenge', {challengeId});
            navigate('/game');
          } else {
            console.log(`The returned value is: ${value}`);
            socket.emit('reject_challenge', {challengeId});
          }
        }
      );
      
    });
    return () => {
      socket.off('game_invitation');
    };
  }, []);

  useEffect(() => {
    // socket.on('start_challenge', (args: any) => {
    // })
    socket.on('challenge_accepted', (data) => {
      navigate('/game');
    });
    socket.on('challenge_rejected', (data) => {
      swal('Your request has been rejected!'); //TODO: add invitee name
    });
  }, []);

  return <>{children}</>;
};

export default SocketProvider;

//*DONE show game request Modal
