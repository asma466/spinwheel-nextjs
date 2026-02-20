'use client';

import axios from 'axios';
import { useRef, useState, useEffect, useId } from 'react';

export interface WheelComponentProps {
  segments: string[];
  segColors: string[];
  onFinished: (segment: string) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  primaryColor?: string;
  contrastColor?: string;
  buttonText?: string;
  isOnlyOnce?: boolean;
  size?: number;
  upDuration?: number;
  downDuration?: number;
  fontFamily?: string;
  fontSize?: string;
  outlineWidth?: number;
}

const WheelComponent = ({
  segments,
  segColors,
  setOpenSnackbar,
  onFinished,
  primaryColor = 'black',
  contrastColor = 'white',
  buttonText = 'Spin',
  isOnlyOnce = true,
  size = 190,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'Arial',
  fontSize = '1em',
  outlineWidth = 10,
}: WheelComponentProps) => {
  const id = useId();
  const canvasId = useRef(`canvas-${id}`);
  const wheelId = useRef(`wheel-${id}`);
  const dimension = (size + 20) * 2;
  let currentSegment = '';
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext: CanvasRenderingContext2D | null = null;
  let maxSpeed = Math.PI / segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = size + 20;
  const centerY = size + 20;
  let prize: string | null = null;
  let tenstringid: string | null = null;

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('x');
      
      console.log(`[WHEEL COMPONENT] URL search params:`, searchParams.toString());
      console.log(`[WHEEL COMPONENT] ID from URL (x param):`, id);
      
      // Only proceed if ID is available
      if (!id) {
        console.warn('[WHEEL COMPONENT] No birthday record ID provided. Use ?x=recordId');
        wheelInit();
        return;
      }

      tenstringid = id;
      console.log(`[WHEEL COMPONENT] Set tenstringid to:`, tenstringid);

      try {
        console.log(`[WHEEL COMPONENT] Sending request to /api/spinwheel with id:`, id);
        const response = await axios.post('/api/spinwheel', {
          id: id, // Send as string first, API will parse it
        });

        const data = response.data;
        console.log(`[WHEEL COMPONENT] Received response:`, data);

        if (data.prize) {
          prize = data.prize.trim();
          console.log(`[WHEEL COMPONENT] Prize set to:`, prize);
        }
      } catch (error: any) {
        console.error('[WHEEL COMPONENT] Error fetching data:', error);
        if (error.response?.status === 403) {
          console.warn('[WHEEL COMPONENT] ⚠️ You have already spun the wheel');
          alert('You have already spun the wheel this year. Come back next year!');
        } else if (error.response?.status === 404) {
          console.error('[WHEEL COMPONENT] ❌ Birthday record not found');
          alert('Birthday record not found');
        }
        // Still initialize wheel even if fetch fails
      }

      wheelInit();

      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
    };

    fetchData();
  }, []);

  const initCanvas = () => {
    let canvas: HTMLCanvasElement | null = document.getElementById(
      canvasId.current
    ) as HTMLCanvasElement;

    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', `${dimension}`);
      canvas.setAttribute('height', `${dimension}`);
      canvas.setAttribute('id', canvasId.current);
      document.getElementById(wheelId.current)?.appendChild(canvas);
    }
    canvas?.addEventListener('click', spin, false);
    canvasContext = canvas?.getContext('2d');
  };

  const spin = () => {
    console.log(prize);

    if (prize) {
      // Note: Send prize in finish API call
      axios.post('/api/finish', {
        id: parseInt(tenstringid || '0'),
        prize: prize,
      });
      isStarted = true;
      if (timerHandle === 0) {
        spinStart = new Date().getTime();
        maxSpeed = Math.PI / segments.length;
        frames = 0;
        timerHandle = window.setInterval(onTimerTick, timerDelay);
      }
    } else {
      setOpenSnackbar(true);
      console.log('Not allowed to spin');
    }
  };

  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (prize) {
        if (currentSegment === prize && frames > segments.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta =
          maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      prize = null;
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    const value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor;
    ctx.font = `bold ${fontSize} ${fontFamily}`;
    ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  const drawWheel = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '1em ' + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor;
    ctx.fill();
    ctx.font = 'bold 1em ' + fontFamily;
    ctx.fillStyle = contrastColor;
    ctx.textAlign = 'center';
    ctx.fillText(buttonText, centerX, centerY + 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  };

  const drawNeedle = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fillStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 1.5em ' + fontFamily;
    currentSegment = segments[i];
    isStarted &&
      ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };

  const clear = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.clearRect(0, 0, dimension, dimension);
  };

  return (
    <div id={wheelId.current}>
      <canvas
        id={canvasId.current}
        width={dimension}
        height={dimension}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto',
        }}
      />
    </div>
  );
};

export default WheelComponent;
