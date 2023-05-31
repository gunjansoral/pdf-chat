import { useContext, useEffect, useRef, useState } from 'react';
import './style.css'
import { CiEdit } from 'react-icons/ci'
import { AiFillFilePdf, AiOutlineEnter, AiOutlineFilePdf } from 'react-icons/ai'
import Info from '../Info';
import useClickOutside from '../../CustomHooks/useClickOutside';
import { io } from 'socket.io-client';
import UserContext from '../../Contexts/userContext';

const UploadPdf = ({ setIsUploadPdf, socket }) => {
  const dropZoneRef = useRef(null);
  const fileNameRef = useRef(null);
  const fileNameContainerRef = useRef(null)

  const chooseFileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [text, setText] = useState('');
  const [isTextEdit, setIsTextEdit] = useState(false);
  const [fileName, setFileName] = useState('');
  const { userData } = useContext(UserContext)


  useClickOutside(fileNameContainerRef, () => {
    if (isTextEdit) {
      setIsTextEdit(false);
      setText(fileName);
    }
  });

  useClickOutside(dropZoneRef, () => {
    setIsUploadPdf(false)
  });

  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.style.width = `${fileNameRef.current.value.length + 0.5}ch`;
    }
  }, [text]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (pdfValidation(droppedFile.name)) {
      setFile(droppedFile);
      setText(droppedFile.name);
      setFileName(droppedFile.name);
    } else {
      console.log('invalid file format')
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (pdfValidation(selectedFile?.name)) {
      setFile(selectedFile);
      setText(selectedFile.name);
      setFileName(selectedFile.name);
    } else {
      console.log('invalid file format')
    }
  };

  const handleRename = async () => {
    setIsTextEdit(true);
    await setText(fileName.replace(/\.pdf$/, ''))
    await fileNameRef.current.focus();
  };

  const handleRenameSubmit = async () => {
    if (text === '') {
      console.log('pdf name cannot be empty')
    } else {
      await setFileName(text + '.pdf');
      await setText(fileName.replace(/\.pdf$/, ''))
      setIsTextEdit(false);
    }
  };

  const resetName = () => {
    setFileName(file.name);
  };

  const handleSubmit = async (file, fileName) => {
    try {
      const fileData = await readFileAsArrayBuffer(file); // Function to read file as ArrayBuffer
      const fileObject = {
        data: fileData,
        name: fileName
      };
      await socket.emit('uploadpdf', fileObject); // Emit the event 'pdfFile' with the file object
      setIsUploadPdf(false)
    } catch (error) {
      console.log('An error occurred while sending the PDF file:', error);
    }
  };

  // Function to read file as ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleCancel = () => {
    // Clear the uploaded file and reset the component state
    setFile(null);
    setText('');
    setIsTextEdit(false);
    setFileName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Perform the action when Enter key is pressed
      if (isTextEdit) {
        handleRenameSubmit();
      } else {
        handleSubmit();
      }
    }
  };

  const pdfValidation = (fileName) => {
    const format = fileName.slice(-3);
    if (format === 'pdf')
      return true;
    else
      return false;
  }

  return (
    <div className='drop-zone'>
      <div ref={dropZoneRef}>
        {file ? (
          <div className='file-container'>
            <div className='uploaded-pdf-container' >
              <div className="uploaded-pdf">
                <AiFillFilePdf size='100' />
              </div>
              <h4>Uploaded PDF:</h4>
            </div>
            <div ref={fileNameContainerRef} className="filename-container">
              {isTextEdit ? (
                <div className="filename-main-container">
                  <input
                    type='text'
                    ref={fileNameRef}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    onKeyDown={handleKeyDown}
                  />
                  <span>.pdf</span>
                </div>
              ) : (
                <p >{fileName}</p>
              )}
              {isTextEdit ? (
                <Info text='Enter' >
                  <div className="edit-icon" onClick={handleRenameSubmit}>
                    <AiOutlineEnter />
                  </div>
                </Info>

              ) : (
                <Info text='Edit'>
                  <div className="edit-icon" onClick={handleRename}>
                    <CiEdit />
                  </div>
                </Info>

              )}
            </div>

            <div className="buttons-container">
              <div type='submit' onClick={() => handleSubmit(file, fileName)}>
                Submit
              </div>
              <div onClick={handleCancel}>
                Cancel
              </div>
            </div>
          </div>
        ) : (
          <div className='select-pdf-container'>
            <div
              className={`drag-a-pdf-container ${dragging ? 'dragging' : ''} `}
              onClick={() => chooseFileRef.current.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="drag-a-pdf">
                <AiOutlineFilePdf size='100' />
              </div>
              <h4>Drag and drop a PDF file here</h4>
            </div>
            <p>or</p>
            <input
              ref={chooseFileRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPdf;
