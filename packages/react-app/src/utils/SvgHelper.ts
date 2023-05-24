const svgToBase64 = (svgElem: SVGElement) => {
  const qrString = new XMLSerializer().serializeToString(svgElem);
  const base64Str = window.btoa(qrString);
  return `data:image/svg+xml;base64,${base64Str}`;
};

const svgToDataURL = (
  svgData: string,
  width: number,
  height: number
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'temp-canvas');
  canvas.setAttribute('style', 'display: none');
  document.body.appendChild(canvas);

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('no canvas 2d context');
  }

  const img = document.createElement('img');
  img.setAttribute('src', svgData);

  return new Promise((res) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const url = canvas.toDataURL('image/jpeg', 1.0);
      canvas.remove();
      res(url);
    };
  });
};

const SvgHelper = { svgToBase64, svgToDataURL };
export default SvgHelper;
