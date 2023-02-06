const faceFilterCanvasRef = useRef(null);
const canvasRef = useRef(null);
const pictureCanvasRef = useRef(null);
const logoCanvasRef = useRef(null);

const snapshot = useCallback(() => {
  const canvas = pictureCanvasRef.current;
  canvas.getContext('2d').drawImage(faceFilterCanvasRef.current, 0, 0);

  const img = new Image();
  img.src = '/images/logo.png';

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