import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VerificationPage = () => {
  const { token } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8081/verify/${token}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  return (
    <div>
      <p>Verifying...</p>
    </div>
  );
};

export default VerificationPage;
