import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {Tooltip, Typography, Dialog, DialogContent } from '@mui/material';
import moment from 'moment';
import Options from './Options';
import useFirestore from '../../firebase/useFirestore';
import { IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
import { DialogActions } from '@mui/material';
import ImgEditor from '../imgeditor';



function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function ImagesList() {
  const { documents } = useFirestore();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(null);
  //
  const [selectedImageTags, setSelectedImageTags] = React.useState([]);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [filterTags, setFilterTags] = React.useState([]);
  //
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedImageIndexForEdit, setSelectedImageIndexForEdit] = React.useState(null);

  //
  const [downloadFormatOpen, setDownloadFormatOpen] = React.useState(false);
  const [selectedDownloadFormat, setSelectedDownloadFormat] = React.useState("jpeg");





  //filter
  const filteredDocuments = documents.filter(item =>
    filterTags.every(filterTag =>
      item?.data?.utags.some(tag =>
        tag.toLowerCase().includes(filterTag.toLowerCase())
      )
    )
  );
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImageIndex(null);
    setSidebarOpen(false); 
    setIsEditing(false);
  };
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  const handleFullImageClick = (index) => {
    setSelectedImageIndex(index);
    setOpenDialog(true);
  };
  const handleTagsButtonClick = () => {
    // Implement the logic to show tags for the selected image
    if (selectedImageIndex !== null) {
      setSelectedImageTags(documents[selectedImageIndex]?.data?.utags || []);
      setSidebarOpen(true); // Open the sidebar when "Read Tags" is clicked
    }
  };

  const handleEditButtonClick = () => {
    setSelectedImageIndexForEdit(selectedImageIndex);
    setOpenDialog(false);
    setIsEditing(true);
  };
  

  const handleDownloadButtonClick = () => {
    setDownloadFormatOpen(true); // Open the download format selection dialog
  };

  const handleDownloadFormatSelect = async (format) => {
    setSelectedDownloadFormat(format);
    setDownloadFormatOpen(false); // Close the download format selection dialog
  
    const selectedDocument = documents[selectedImageIndex];
    const imageURL = selectedDocument?.data?.imageURL;
    const imageId = selectedDocument?.id;
  
    try {
      const response = await fetch(imageURL);
      const data = await response.blob();
      const blob = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blob;
      link.download = imageId + '.' + format; // Set the filename with selected format
      link.click();
      URL.revokeObjectURL(blob);
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };
  

  const handlePrevImageClick = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      setSelectedImageTags(documents[selectedImageIndex-1]?.data?.utags || []);
    }
  };

  const handleNextImageClick = () => {
    if (selectedImageIndex < documents.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
      setSelectedImageTags(documents[selectedImageIndex+1]?.data?.utags || []);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Filter by tags"
        value={filterTags.join(', ')}
        onChange={e => {
          const tags = e.target.value.split(',').map(tag => tag.trim());
          setFilterTags(tags);
        }}
        style={{
          position: 'absolute',
          top: '200px',
          right: '275px',
          padding: '5px',
        }}
      />
      <button
        onClick={() => setFilterTags([])}
        style={{
          position: 'absolute',
          top: '200px',
          right: '185px',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Clear Filter
      </button>
      <ImageList variant="quilted" cols={4} rowHeight={200}>
        {filteredDocuments.map((item, index) => (
          <ImageListItem
            key={item?.id}
            cols={
              pattern[
                index - Math.floor(index / pattern.length) * pattern.length
              ].cols
            }
            rows={
              pattern[
                index - Math.floor(index / pattern.length) * pattern.length
              ].rows
            }
            sx={{
              opacity: '1',
              transition: 'opacity .3s linear',
              cursor: 'pointer',
              '&:hover': { opacity: 1 },
            }}
          >

            <Options imageId={item.id}  uid={item?.data?.uid} imageURL={item?.data?.imageURL}/>
            <img
              {...srcset(
                item?.data?.imageURL,
                200,
                pattern[
                  index - Math.floor(index / pattern.length) * pattern.length
                ].rows,
                pattern[
                  index - Math.floor(index / pattern.length) * pattern.length
                ].cols
              )}
              alt={item?.data?.uName || item?.data?.uEmail}
              loading="lazy"
            />
            <Typography
              variant="body2"
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                color: 'white',
                background: 'rgba(0,0,0, .3)',
                p: '5px',
                borderTopRightRadius: 8,
              }}
            >
              {moment(item?.data?.timestamp?.toDate()).fromNow()}
            </Typography>
            <Tooltip
              title={item?.data?.uName || item?.data?.uEmail}
              sx={{
                position: 'absolute',
                bottom: '3px',
                right: '3px',
              }}
            >
            </Tooltip>
            <IconButton
              onClick={() => handleFullImageClick(index)}
              className="image-open-button"
              sx={{
                position: 'absolute',
                right: 2,
                bottom: 10,
                color: 'white',
                background: 'rgba(0,0,0,.3)',
              }}
            >
              <FullscreenIcon />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        fullScreen
        disableBackdropClick={true}
      >
        <IconButton
          aria-label="Close"
          onClick={() => setIsEditing(false)}
          sx={{
            color: 'red',
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        {selectedImageIndex !== null && (
          <ImgEditor
          imageURL={documents[selectedImageIndexForEdit]?.data?.imageURL}
          />
        )}
      </Dialog>
      <Dialog open={downloadFormatOpen} onClose={() => setDownloadFormatOpen(false)}>
        <DialogContent>
          <Typography variant="h6">Select Download Format</Typography>
          <Button onClick={() => handleDownloadFormatSelect("webp")}>WebP</Button>
          <Button onClick={() => handleDownloadFormatSelect("png")}>PNG</Button>
          <Button onClick={() => handleDownloadFormatSelect("jpeg")}>JPEG</Button>
        </DialogContent>
      </Dialog>
      <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      disableBackdropClick={true} 
    > 
      {selectedImageIndex !== null && (
        <>
          <IconButton
            aria-label="Close"
            onClick={handleCloseDialog}
            sx={{
              color: 'red',
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            style={{
              display: 'flex',
              alignItems: 'center',  // Center vertically
              justifyContent: 'center', // Center horizontally
              width: '500',   // Take full width of the dialog content
              height: '500',  // Take full height of the dialog content
            }}
          >
            {sidebarOpen && (
                <div
                  style={{
                    width: '250px',           // Set the width of the sidebar
                    backgroundColor: '#f5f5f5', // Set the background color
                    padding: '20px',           // Add padding for content
                  }}
                >
                  <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                      TAGS
                    </Typography>
                    <div>
                      {selectedImageTags.map((tag, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            marginBottom: '5px',
                            backgroundColor: 'lightgray', // Add a background color to tags
                            borderRadius: '4px',          // Add rounded corners
                            padding: '2px 6px',           // Add padding
                            display: 'inline-block',      // Display tags inline
                            marginRight: '5px',           // Add spacing between tags
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </div>
                    <Button
                        onClick={handleSidebarClose}
                        variant="outlined"
                        sx={{
                          marginTop: '20px',
                          borderColor: 'gray',
                          color: 'gray',
                          '&:hover': {
                            borderColor: 'red',
                            color: 'red',
                          },
                        }}
                      >
                        Close
                    </Button>
                </div>
              )}
            <Typography
                variant="body2"
                component="span"
                sx={{
                  marginTop: '10px',                 // Increase margin for better spacing
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'black',                    // Black text color// Rounded corners             // Adjust padding
                  fontSize: '20px',                  // Font size
                  fontWeight: 'bold',                // Bold font weight
                  textTransform: 'uppercase',        // Capitalize every letter
                  zIndex: 1,                         // Ensure the tag is above the image
                }}
              >
                {documents[selectedImageIndex]?.data?.utags[0]}
              </Typography>
            <img
              {...srcset(
                documents[selectedImageIndex]?.data?.imageURL,
                800  // Set the desired fixed size for images
              )}
              alt={documents[selectedImageIndex]?.data?.uName || documents[selectedImageIndex]?.data?.uEmail}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: '600px',   // Ensure image doesn't exceed content's width
                height: '400px',  // Ensure image doesn't exceed content's height
                marginTop:'20px'
            }}
            />
              {/* Implement additional features like tags, editing, and downloading here */}
              {/* You can use a similar approach as shown in the second code */}
            </DialogContent>
            <DialogActions style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={handlePrevImageClick}><ArrowBackIcon /></Button>
              <div>
              <Button
                  onClick={handleTagsButtonClick}
                  variant="outlined"
                  sx={{
                    marginRight: '10px',
                    borderColor: 'blue',    // Change border color
                    color: 'blue',          // Change text color
                    fontWeight:'Bold',
                    '&:hover': {
                      background: 'blue',   // Change background color on hover
                      color: 'white',       // Change text color on hover
                    },
                  }}
                >
                  Read Tags
                </Button>

                <Button
                  onClick={handleEditButtonClick}
                  variant="outlined"
                  sx={{
                    marginRight: '10px',
                    borderColor: 'green',   // Change border color
                    color: 'green',         // Change text color
                    fontWeight:'Bold',
                    '&:hover': {
                      background: 'green',  // Change background color on hover
                      color: 'white',       // Change text color on hover
                    },
                  }}
                >
                  Edit
                </Button>

                <Button
                  onClick={handleDownloadButtonClick}
                  variant="outlined"
                  sx={{
                    borderColor: 'purple',  // Change border color
                    color: 'purple',        // Change text color
                    fontWeight:'Bold',
                    '&:hover': {
                      background: 'purple', // Change background color on hover
                      color: 'white',       // Change text color on hover
                    },
                  }}
                >
                  Download
                </Button>
              </div>
              <Button onClick={handleNextImageClick}><ArrowForwardIcon /></Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

const pattern = [
  {
    rows: 2,
    cols: 2,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 2,
  },
  {
    rows: 1,
    cols: 2,
  },
  {
    rows: 2,
    cols: 2,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
];