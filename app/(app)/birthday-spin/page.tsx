'use client';

import { useState } from 'react';
import { DialogDemo } from '@/src/component/common/windialog';
import { Badge } from '@radix-ui/themes';
import { Toast } from '@/src/component/common/Toast';
import WheelComponent from '@/src/component/common/wheelanimation';
import Confetti from 'react-confetti';
import { useSearchParams } from 'next/navigation';

export default function BirthdaySpinPage() {
  const searchParams = useSearchParams(); // ✅ call hook here
  const recordId = searchParams.get('x'); // ✅ get recordId from URL
  const segments = [
    'Planter',
    'Scented Candles',
    'Fidget Toys',
    'Vase',
    'Table Lamp',
    'Photo Frame',
  ];
  const segColors = [
    '#FEDC00',
    '#6EA943',
    '#DB2429',
    '#794B9D',
    '#008FD5',
    '#1CBB9F',
    '#E30000',
  ];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [opensnack, setopensnack] = useState(false);
  const [finalprize, setfinalprize] = useState('');

  const onFinished = (winner: string) => {
    setfinalprize(winner);
    console.log(winner);
    setTimeout(() => {
      setDialogOpen(true);
    }, 800);
  };

  const onDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div
      className="app"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0px',
        backgroundColor: '#f9f9f9',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {dialogOpen && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <Toast
        message="Only Spin once, and if you receive an email from us"
        isOpen={opensnack}
        onClose={() => setopensnack(false)}
        type="error"
        duration={2000}
      />

      <DialogDemo
        open={dialogOpen}
        onDialogClose={onDialogClose}
        gift={finalprize}
      />

      <header style={{ textAlign: 'center', marginBottom: '0px' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#333',
            marginTop: '0',
            marginBottom: '10px',
          }}
        >
          🎉 Happy Birthday! 🎂
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          "Celebrate your special day with Zeta's Birthday Spin the Wheel!"
        </p>
      </header>

      <div className="wheel-container">
        <WheelComponent
          segments={segments}
          segColors={segColors}
          onFinished={(winner) => onFinished(winner)}
          primaryColor="black"
          contrastColor="white"
          buttonText="Spin"
          setOpenSnackbar={setopensnack}
          isOnlyOnce={false}
          size={190}
          upDuration={500}
          downDuration={600}
          fontFamily="Arial"
        />
      </div>

      <h2
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#222',
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        Spin the wheel and win exciting prizes!
      </h2>
      <Badge
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#60ba97',
          color: '#fff',
          borderRadius: '20px',
          fontWeight: 'bold',
        }}
      >
        Powered by ZetaTech
      </Badge>

      <footer
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          fontSize: '0.8rem',
          color: '#888',
          textAlign: 'right',
        }}
      >
        <p>*One spin per person only.</p>
      </footer>
    </div>
  );
}
