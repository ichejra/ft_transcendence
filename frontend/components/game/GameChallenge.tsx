import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import Member from '../utils/TeamMember';
import { frameData } from '../../consts';
import { socket } from '../../pages/SocketProvider';
import { useEffect, useState } from 'react';






const GameChallenge  =() => {
  const navigate= useNavigate();
  const [challengeId, setChallengeId]= useState();

  useEffect(() => {
    socket.on('game_invitation', (id) => {
      console.log('invitation recieved!');
      setChallengeId(id);
    });
  })
}




