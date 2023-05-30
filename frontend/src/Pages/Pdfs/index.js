import { useContext, useEffect, useState } from 'react'
import UploadPdf from '../../Components/UploadPdf'
import './style.css'
import Pdf from '../../Components/Pdf'
import { io } from 'socket.io-client';
import UserContext from '../../Contexts/userContext';
import UploadPdfButton from '../../Components/UploadPdfButton';

const Pdfs = () => {
  const { userData } = useContext(UserContext);
  const [pdfs, setPdfs] = useState([]);
  const [isUploadPdf, setIsUploadPdf] = useState(false)

  let socket;
  const ENDPOINT = 'http://localhost:8000/';
  socket = io(ENDPOINT, {
    query: {
      token: userData.token,
    },
  });


  useEffect(() => {
    socket.on('connect', () => {
    });
    socket.emit('getpdfs', () => {

    })
    socket.on('pdfsData', (data) => {
      setPdfs(data);
    })
  }, [isUploadPdf]);

  return (
    <div className="pdfs-container">
      <div className="pdfs-header">
        <h1>Pdf Collection</h1>
      </div>
      {pdfs.map((pdf, i) => (
        <Pdf key={i} name={pdf.fileName} />
      ))}
      <UploadPdfButton onClick={() => setIsUploadPdf(true)} />
      {isUploadPdf && <UploadPdf setIsUploadPdf={setIsUploadPdf} />}
    </div>
  )
}

export default Pdfs