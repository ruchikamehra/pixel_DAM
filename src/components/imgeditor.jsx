import React, { useState,useEffect } from 'react';
import './styles/imgedit.scss';
import ReactCrop  from 'react-image-crop';
import { GrRotateLeft, GrRotateRight } from 'react-icons/gr';
import { CgMergeVertical, CgMergeHorizontal } from 'react-icons/cg';
import { IoMdUndo, IoMdRedo, IoIosImage } from 'react-icons/io';
import 'react-image-crop/dist/ReactCrop.css';


const ImgEditor = ({imageURL}) => {

  useEffect(() => {
    if (imageURL) {
      const img = new Image();
      img.onload = () => {
        setDetails(img);
        setState({
          ...state,
          image: img.src,
        });
      };
      img.src = imageURL;
    }
  }, [imageURL]);
  
  const filterElement = [
    {
      name: 'brightness',
      maxValue:200
    },
    {
      name: 'grayscale',
      maxValue:200
    },
    {
      name: 'sepia',
      maxValue:200
    },
    {
      name: 'saturated',
      maxValue:200
    },
    {
      name: 'contrast',
      maxValue:200
    },
    {
      name: 'hueRotate',
    },
  ];
  const [property,setProperty]=useState(
    {
        name: 'brightness',
        maxValue:200
    }
  )
  const [details,setDetails]=useState('')
  const [crop,setCrop]= useState('')
  const [state, setState] = useState({
    image:'',
    brightness:100,
    grayscale:0,
    sepia:0,
    saturate:100,
    contrast:100,
    hueRotate:0,
    rotate:0,
    vertical :1,
    horizontal:1,
  });
  const inputHandle=(e)=>{
    setState({
        ...state,
        [e.target.name]: e.target.value
    })
  }
  const leftRotate=()=>{
    setState({
        ...state,
        rotate : state.rotate - 90
    })
  }
  const rightRotate=()=>{
    setState({
        ...state,
        rotate : state.rotate + 90
    })
  }
  const verticalFlip=()=>{
    setState({
        ...state,
        vertical: state.vertical===1? -1:1
    })
  }
  const horizontalFlip=()=>{
    setState({
        ...state,
        horizontal: state.horizontal===1? -1:1
    })
  }
  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setState({
          ...state,
          image: reader.result,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const imageCrop = async () => {
    if (!details || !crop) {
      return;
    }
  
    const canvas = document.createElement('canvas');
    const scaleX = details.naturalWidth / details.width;
    const scaleY = details.naturalHeight / details.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');
  
    // Fetch the image as a blob
    const response = await fetch(state.image);
    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);
  
    img.onload = () => {
      // Draw the cropped image onto the canvas
      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
  
      // Convert the canvas data to a downloadable link
      const base64Url = canvas.toDataURL('image/jpeg');
  
      // Update the state with the cropped image
      setState({
        ...state,
        image: base64Url,
      });
  
      // Clean up the object URL
      URL.revokeObjectURL(img.src);
    };
  };
const resetChanges=()=>{
    setProperty({
        name: 'brightness',
        maxValue: 200,
      });
  
      setState({
        ...state,
        brightness: 100,
        grayscale: 0,
        sepia: 0,
        saturate: 100,
        contrast: 100,
        hueRotate: 0,
        rotate: 0,
        vertical: 1,
        horizontal: 1,
    });
};

const saveImage = () => {
  // Create a new canvas with the original image size
  const canvas = document.createElement('canvas');
  canvas.width = details.naturalWidth;
  canvas.height = details.naturalHeight;
  const ctx = canvas.getContext('2d');

  // Apply the image transformations
  ctx.filter = `brightness(${state.brightness}%) grayscale(${state.grayscale}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) hue-rotate(${state.hueRotate}deg)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((state.rotate * Math.PI) / 180);
  ctx.scale(state.vertical, state.horizontal);

  // Draw the original image on the new canvas
  ctx.drawImage(details, -canvas.width / 2, -canvas.height / 2);

  // Convert canvas to Blob
  canvas.toBlob((blob) => {
    // Create a Blob URL for the blob
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'image_edit.jpg';
    link.click();

    // Revoke the Blob URL to free up memory
    URL.revokeObjectURL(blobUrl);
  }, 'image/jpeg');
};


  return (
    <div className='image_editor'>
      <div className='card'>
        <div className="card_header">
          <h2>In-Browser Image Transformation</h2>
        </div>
        <div className='card_body'>
          <div className="sidebar">
            <div className="side_body">
              <div className="filter_section">
                <span>Filters</span>
                <div className="filter_key">
                  {filterElement.map((v, i) => <button className={property.name===v.name ? 'active':''} onClick={()=>setProperty(v)} key={i}>{v.name}</button>
                  )}
                </div>
              </div>
              <div className="filter_slider">
                <div className="label_bar">
                  <label htmlFor='range'>Value</label>
                  <span>{state[property.name]-100}</span>
                </div>
                <input name={property.name} onChange={inputHandle} value={state[property.name]} max={property.maxValue} type='range' />
              </div>
              <div className="rotate">
                <label htmlFor=''>Rotate & Flip</label>
                <div className="icon">
                  <>
                    <div onClick={leftRotate}><GrRotateLeft /></div>
                    <div onClick={rightRotate}><GrRotateRight /></div>
                    <div onClick={verticalFlip}><CgMergeVertical /></div>
                    <div onClick={horizontalFlip}><CgMergeHorizontal /></div>
                  </>
                </div>
              </div>
            </div>
            <div className="reset">
              <button onClick={resetChanges}>Reset</button>
              <button onClick={saveImage} className='save'>Save Image</button>
            </div>
          </div>
          <div className="image_section">
            <div className="image">
                {
                    state.image ? <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                    <img onLoad={(e) => setDetails(e.target)} style={{
                        filter: `brightness(${state.brightness}%) grayscale(${state.grayscale}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) hue-rotate(${state.hueRotate}deg)`,
                        transform: `rotate(${state.rotate}deg) scale(${state.vertical}, ${state.horizontal})`,}}
                        src={state.image}alt=""/>
                    </ReactCrop>:
                        <label htmlFor='choose'>
                            <IoIosImage/>
                            <span>Choose Image</span>
                        </label>
                }
            </div>
            <div className="image_select">
              <button className='undo'><IoMdUndo/></button>
              <button className='redo'><IoMdRedo/></button>
              {
                crop && <button onClick={imageCrop} className='crop'>Crop Image</button>
              }
              
              <label htmlFor="imageInput">Choose Image</label>
              <input onChange={imageHandle} type="file" id='imageInput' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImgEditor;
