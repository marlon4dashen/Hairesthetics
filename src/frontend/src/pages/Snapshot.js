// Declare four references to canvas elements using the useRef hook
const faceFilterCanvasRef = useRef(null);
const canvasRef = useRef(null);
const pictureCanvasRef = useRef(null);
const logoCanvasRef = useRef(null);

// Define a function to capture a snapshot of the image with the filter applied
const snapshot = useCallback(() => {
  const canvas = pictureCanvasRef.current;
  canvas.getContext('2d').drawImage(faceFilterCanvasRef.current, 0, 0);

  // Create a new image element with the logo to be added to the snapshot
  const img = new Image();
  img.src = '/images/logo.png';

  // Add event listeners to the image element to handle errors and loading
  img.addEventListener('error', e => {
    console.error(e);
  });
  img.addEventListener('load', e => {
    logoCanvasRef.current
      .getContext('2d')
      .drawImage(
        img,
        sizing.width - (144 + 24),
        sizing.height - (42.38 + 24),
        144,
        42.38
      );

    // Use the mergeImages utility function to combine the filtered image, original image, and logo
    mergeImages([
      canvas.toDataURL('image/png'),
      canvasRef.current.toDataURL('image/png'),
      logoCanvasRef.current.toDataURL('image/png'),
    ]).then(b64 => {
      setDownloadUrl(b64);
      setShareData(b64);
    });
  });
}, []);