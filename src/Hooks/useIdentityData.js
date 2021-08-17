import { useState } from 'react';

export default function useIdentityData() {
  const getIdentityData = () => {
    const identityDataString = localStorage.getItem('identity');
    const identityData = JSON.parse(identityDataString);
    return identityData;
  };

  const [identityData, setIdentityData] = useState(getIdentityData());

  const saveIdentityData = (identityData) => {
    if(!identityData.publicKeyAdded) {
      identityData.publicKeyAdded = Object.keys(identityData.users)[0];
    }
    localStorage.setItem('identity', JSON.stringify(identityData));
    setIdentityData(identityData);
  };

  return {
    setIdentityData: saveIdentityData,
    identityData
  }
}