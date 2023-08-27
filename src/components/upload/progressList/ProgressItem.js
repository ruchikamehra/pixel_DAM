import { CheckCircleOutline } from '@mui/icons-material';
import { Box, ImageListItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CircularProgressWithLabel from './CircularProgWithLabel';
import { v4 as uuidv4 } from 'uuid';
import uploadFileWithProgress from '../../../firebase/uploadFileWithProg';
import addDocument from '../../../firebase/addDocument';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const ProgressItem = ({ file }) => {
  const [progress, setProgress] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const {currentUser,setAlert}=useAuth()

  const analyzeImage = async () => {
    try {
      if (!file) {
        console.log('Please select an image');
        return;
      }

      const apiKey = 'acc_141ccf9c6b6455d';
      const apiSecret = '55350b92f1644801f2e7ba60b305bad2';
      const apiUrl = 'https://api.imagga.com/v2/tags';

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(apiUrl, formData, {
        auth: {
          username: apiKey,
          password: apiSecret,
        },
      });

      const detectedTags = response.data.result.tags.slice(0, 10);
      // Upload image after analyzing tags
      const imageName = uuidv4() + '.' + file.name.split('.').pop();
      const url = await uploadFileWithProgress(
        file,
        `gallery/${currentUser.uid}`,
        imageName,
        setProgress
      );
      const galleryDoc = {
        imageURL: url,
        uid: currentUser?.uid || '',
        uEmail: currentUser?.email || '',
        uName: currentUser?.displayName || '',
        uPhoto: currentUser?.photoURL || '',
        utags: detectedTags.map((tag) => tag.tag.en),
      };
      await addDocument('gallery', galleryDoc, imageName);
      setImageURL(null);
    } catch (error) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: error.message,
        timeout: 8000,
        location: 'main',
      });
      console.log(error);
    }
  };
   

  useEffect(() => {
    setImageURL(URL.createObjectURL(file));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    analyzeImage();
  }, [file, currentUser.uid]);

  return (
    imageURL && (
      <ImageListItem cols={1} rows={1}>
        <img src={imageURL} alt="images gallery" loading="lazy" />
        <Box sx={backDrop}>
          {progress < 100 ? (
            <CircularProgressWithLabel value={progress} />
          ) : (
            <CheckCircleOutline
              sx={{ width: 60, height: 60, color: 'lightgreen' }}
            />
          )}
        </Box>
      </ImageListItem>
    )
  );
};

export default ProgressItem;

const backDrop = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,.5)',
};
