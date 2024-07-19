import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from '../ui/dialog';
import { ZoomInIcon, ZoomOutIcon, DownloadIcon, RotateCwIcon } from 'lucide-react';
import {Button} from '../ui/button';
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  src: string;
};

function MediaViewModal({ src, open, setOpen }: Props) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotateAngle, setRotateAngle] = useState(0);
  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 1)); 
  };
  const handleRotate = () => {
    // it should go from 0 to 90 to 180 to 270 to 0 
    // i.e each click should rotate the image by 90 degrees then once it reaches 270 
    // it should go back to 0
    // Rotate the image
    setRotateAngle(prevAngle => (prevAngle + 90) % 360);
  }
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'image.jpg';
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='bg-transparent border-none'>
        <div className="relative h-[500px] max-w-[1000px]  ring-transparent overflow-hidden rounded-lg">
          <figure className="flex justify-center">
            <img
              src={src}
              alt="Media"
              className="object-cover max-w-[1000px] w-full transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel}) rotate(${rotateAngle}deg)` }}
            />
          </figure>
        </div>
        <DialogFooter className="flex max-w-[500px] mx-auto justify-between mt-4">
            
          <div className="flex self-center bg-black/90 p-2 rounded-lg space-x-2 items-center">
            <Button
              onClick={handleZoomIn}
              variant="ghost"
              size="icon"
            >
              <ZoomInIcon className="w-5 h-5 text-gray-200" />
              <span className="ml-1 sr-only">Zoom In</span>
            </Button>
            <p className="text-white">{Math.round(zoomLevel * 100)}%</p>
            <Button
              onClick={handleZoomOut}
              className="rounded"
              variant="ghost"
              size="icon"
            >
              <ZoomOutIcon className="w-5 h-5 text-gray-200" />
              <span className="ml-1 sr-only">Zoom Out</span>
            </Button>
          </div>
          <div className="flex space-x-2 items-center">
            <Button
              onClick={handleRotate}
              variant="ghost"
              size="icon"
            >
              <RotateCwIcon className="w-5 h-5 text-gray-200" />
              <span className="ml-1 sr-only">Rotate</span>
            </Button>
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="icon"
            >
              <DownloadIcon className="w-5 h-5 text-gray-300" />
              <span className="ml-1 sr-only">Download</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MediaViewModal;
