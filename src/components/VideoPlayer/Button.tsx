import React from 'react';

interface ButtonProps {
  label?: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, children }) => {
  return (
    <button
      className="vp-button group hover:bg-surface-a20 relative flex aspect-square h-[30px] w-[30px] cursor-pointer items-center justify-center rounded bg-transparent text-white"
      onClick={onClick}
    >
      <span className="pointer-events-none absolute bottom-full hidden w-max bg-gray-950 px-3 py-2 font-medium opacity-0 transition-opacity duration-200 ease-out group-hover:block group-hover:opacity-100">
        {label}
      </span>
      {/* Most of the time a svg icon */}
      {children}
    </button>
  );
};
