import { AiOutlineFilePdf, AiOutlineUpload } from 'react-icons/ai'
import './style.css'

const UploadPdfButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className='pdf-container upload-pdf-container'>
      <div className="uploaded-pdf-icon">
        <AiOutlineFilePdf size='70' />
      </div>
      <div className="upload-pdf-button-right">
        <AiOutlineUpload size='30' />
        <span>Upload a pdf</span>
      </div>
    </div>
  )
}

export default UploadPdfButton