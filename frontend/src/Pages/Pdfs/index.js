import { useContext, useEffect, useState } from 'react';
import UploadPdf from '../../Components/UploadPdf';
import './style.css';
import Pdf from '../../Components/Pdf';
import { io } from 'socket.io-client';
import UserContext from '../../Contexts/userContext';
import UploadPdfButton from '../../Components/UploadPdfButton';
import _isEqual from 'lodash/isEqual';

const Pdfs = () => {
  const { userData } = useContext(UserContext);
  const [pdfs, setPdfs] = useState([]);
  const [isUploadPdf, setIsUploadPdf] = useState(false);

  const ENDPOINT = 'http://localhost:8000/';
  let socket = io(ENDPOINT, {
    query: {
      token: userData.token,
    },
  });

  socket.on('connect', () => {
    // Handle socket connection
  });


  useEffect(() => {
    socket.emit('getpdfs', () => {
      console.log('pdfs are getting');
    });
  }, [])
  const handlePdfsData = (data) => {
    setPdfs((prevPdfs) => {
      if (!_isEqual(data, prevPdfs)) {
        return data;
      }
      return prevPdfs;
    });
  };
  socket.on('pdfsData', handlePdfsData);

  return (
    <div className="pdfs-container">
      <div className="pdfs-header">
        <h1>Pdf Collection</h1>
      </div>
      {pdfs.map((pdf) => (
        <Pdf key={pdf.id || pdf.fileName} name={pdf.fileName} socket={socket} />
      ))}
      <UploadPdfButton onClick={() => setIsUploadPdf(true)} />
      {isUploadPdf && <UploadPdf setIsUploadPdf={setIsUploadPdf} socket={socket} />}
    </div>
  );
};

export default Pdfs;
