import { useContext, useEffect, useRef, useState } from 'react';
import './style.css';
import { CiEdit } from 'react-icons/ci';
import { AiFillFilePdf, AiOutlineEnter } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Info from '../Info';
import { io } from 'socket.io-client';
import UserContext from '../../Contexts/userContext';

const Pdf = ({ name, socket }) => {
  const fileNameRef = useRef(null);
  const fileNameContainerRef = useRef(null);
  const { userData } = useContext(UserContext);

  const [text, setText] = useState('');
  const [isTextEdit, setIsTextEdit] = useState(false);
  const [fileName, setFileName] = useState(name);
  const [loading, setLoading] = useState(false);

  const handleRenameSubmit = async () => {
    if (text === '') {
      console.log('pdf name cannot be empty');
    } else {
      await setText(fileName.replace(/\.pdf$/, ''));
      await socket.emit('renamepdf', { fileName, text });
      await socket.on('renamepdfedited', async (data) => {
        await setLoading(true)
        await setFileName(data);
        await setLoading(false);
      })
      setIsTextEdit(false);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
    });

  }, []);

  const handleDelete = async () => {
    await socket.emit('deletepdf', {
      fileName
    })
    await socket.emit('getpdfs', () => {
      console.log('getpdfs')
    })
  }

  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.style.width = `${fileNameRef.current.value.length}ch`;
    }

    const handleClickOutside = (event) => {
      if (fileNameContainerRef?.current && !fileNameContainerRef?.current.contains(event.target)) {
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
  }, [isTextEdit]);

  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.style.width = `${fileNameRef.current.value.length + 0.5}ch`;
    }
  }, [text]);

  const handleRename = async () => {
    setIsTextEdit(true);
    await setText(fileName.replace(/\.pdf$/, ''));
    await fileNameRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isTextEdit) {
        handleRenameSubmit();
      }
    }
  };

  const pdfValidation = (fileName) => {
    const format = fileName.slice(-3);
    if (format === 'pdf') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className='pdf-container'>
      <div className="uploaded-pdf-icon">
        <AiFillFilePdf size='70' />
      </div>
      <div className="pdf-filename-container">
        <div ref={fileNameContainerRef} className="pdf-filename">
          {isTextEdit ? (
            <div className="pdf-filename-main-container">
              <span>Name :</span>
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
            <p >{`Name : ${loading ? "Loading..." : fileName}`}</p>
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
        <span>Created at : tuesday</span>
      </div>
      <div className="pdf-right">
        <div className="delete-icon" onClick={handleDelete}>
          <RiDeleteBin6Line />
        </div>
      </div>
    </div>
  );
};

export default Pdf;
