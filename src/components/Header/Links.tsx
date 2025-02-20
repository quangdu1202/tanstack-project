import { Link, useLocation } from '@tanstack/react-router';
import * as React from 'react';

export default function Links({
  menuData,
}: {
  menuData: Record<string, { label: string; to: string }[]>;
}) {
  const location = useLocation();
  const [selectedSubmenu, setSelectedSubmenu] = React.useState<Record<string, string>>({});

  // Automatically set selected submenu based on URL
  React.useEffect(() => {
    const findActiveSubmenu = (): Record<string, string> => {
      for (const [category, submenus] of Object.entries(menuData)) {
        for (const submenu of submenus) {
          if (location.pathname === submenu.to) {
            return { [category]: submenu.label };
          }
        }
        // set "Explore" as default if path includes category
        if (location.pathname.includes(`/${category.toLowerCase()}`)) {
          return { [category]: 'Explore' };
        }
      }
      return {};
    };

    setSelectedSubmenu(findActiveSubmenu());
  }, [location.pathname, menuData]);

  return (
    <nav className="header-links">
      {Object.entries(menuData).map(([category, submenus]) => (
        <DropdownLink
          key={category}
          label={category}
          to={`/${category.toLowerCase()}`}
          submenu={submenus}
          selectedSubmenu={selectedSubmenu[category] || ''}
        />
      ))}
    </nav>
  );
}

function DropdownLink({
  label,
  to,
  submenu,
  selectedSubmenu,
}: {
  label: string;
  to: string;
  submenu: { label: string; to: string }[];
  selectedSubmenu: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className={`relative flex h-full flex-col ${isOpen ? 'overflow-visible' : 'overflow-hidden'}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={to}
        className="hover:border-primary-a50 flex min-h-full flex-col items-center justify-center border-b border-transparent"
      >
        <span>{label}</span>
        {selectedSubmenu && <span className="text-xs normal-case">{selectedSubmenu}</span>}
      </Link>

      {submenu.length > 0 && (
        <div className={`popover-wrapper !static !rounded-t-none`}>
          <div className={`popover-content !pb-0`}>
            {submenu.map((item) => (
              <Link key={item.to} to={item.to} className="list-item">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
