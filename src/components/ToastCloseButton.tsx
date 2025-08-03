import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export const ToastCloseButton = ({ closeToast }: { closeToast?: () => void }) => (
  <span
    onClick={closeToast}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      marginLeft: 12,
      marginRight: 4,
      lineHeight: 1,
      userSelect: 'none',
      opacity: 0.7,
      transition: 'opacity 0.2s',
      paddingBottom: 20,
      width: 24,
      height: 24,
    }}
    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
    onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
    aria-label="Закрыть уведомление"
  >
    <XMarkIcon style={{ width: 28, height: 28, color: '#222' }} />
  </span>
);
