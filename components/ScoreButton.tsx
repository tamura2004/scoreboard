'use client';

import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';

interface ScoreButtonProps {
  value: number;
  onChange: (newValue: number) => void;
}

export const ScoreButton: React.FC<ScoreButtonProps> = ({ value, onChange }) => {
  const handleClick = (delta: number) => {
    const newValue = value + delta;
    if (newValue >= 0) {
      onChange(newValue);
    }
  };

  const buttonStyle = {
    width: '50%',
    height: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: 'action.hover',
    },
    '&:active': {
      bgcolor: 'action.selected',
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '120px',
        height: '80px',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {/* 左上: +10 */}
      <ButtonBase sx={buttonStyle} onClick={() => handleClick(10)} />

      {/* 右上: +1 */}
      <ButtonBase sx={buttonStyle} onClick={() => handleClick(1)} />

      {/* 左下: -10 */}
      <ButtonBase sx={buttonStyle} onClick={() => handleClick(-10)} />

      {/* 右下: -1 */}
      <ButtonBase sx={buttonStyle} onClick={() => handleClick(-1)} />

      {/* 中央の値表示 */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <Typography variant="h2" fontWeight="bold" color="primary">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};
