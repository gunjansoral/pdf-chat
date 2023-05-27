import { useEffect, useRef, useState } from 'react';
import './style.css'
import { CiEdit } from 'react-icons/ci'
import { AiFillFilePdf, AiOutlineEnter, AiOutlineFilePdf } from 'react-icons/ai'

const UploadPdf = () => {
  const fileNameRef = useRef(null);
  const fileNameContainerRef = useRef(null)

  const chooseFileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [text, setText] = useState('');
  const [isTextEdit, setIsTextEdit] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileNameContainerRef?.current && !fileNameContainerRef?.current.contains(event.target)) {
        // Perform the action when clicked outside the input
        if (isTextEdit) {

          setIsTextEdit(false);
          setText(fileName);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    await setIsTextEdit(true);
    await setText(fileName)
    await fileNameRef.current.focus();
  };

  const handleRenameSubmit = async () => {
    await setFileName(text);
    await setText(fileName)
    setIsTextEdit(false);
  };

  const resetName = () => {
    setFileName(file.name);
  };

  const handleSubmit = () => {
    // Perform the submit action with the uploaded file
    if (file) {
      console.log('Submitting file:', file);
    }
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
              <input
                type='text'
                ref={fileNameRef}
                onChange={(e) => setText(e.target.value)}
                value={text}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <p >{fileName}</p>
            )}
            {isTextEdit ? (
              <div className="edit-icon" onClick={handleRenameSubmit}>
                <AiOutlineEnter />
              </div>
            ) : (
              <div className="edit-icon" onClick={handleRename}>
                <CiEdit />
              </div>
            )}
          </div>

          <div className="buttons-container">
            <div type='submit' onClick={handleSubmit}>
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
  );
};

export default UploadPdf;
