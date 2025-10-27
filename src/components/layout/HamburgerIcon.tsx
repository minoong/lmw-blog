interface HamburgerIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerIcon({ isOpen, onClick }: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center space-y-1.5 p-2 focus:outline-none"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 dark:bg-gray-300 ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
      <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 dark:bg-gray-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
      <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 dark:bg-gray-300 ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
    </button>
  );
}
