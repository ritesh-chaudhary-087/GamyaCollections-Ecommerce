import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Add header, navigation, etc. here if needed */}
      <main>{children}</main>
      {/* Add footer here if needed */}
    </div>
  );
}
