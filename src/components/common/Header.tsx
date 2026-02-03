import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hapticFeedback } from '@/lib/telegram';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    hapticFeedback.light();
    navigate(-1);
  };

  return (
    <header className="tg-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-1 -ml-1 rounded-lg active:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};
