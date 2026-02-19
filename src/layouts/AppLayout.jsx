import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AppLayout({ children }) {
  return (
    <div className="app-page">
      <Navbar />
      <div className="app-page__body">
        <Sidebar />
        <main className="app-page__content">
          <div className="page-main">
            <div className="content-container">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
