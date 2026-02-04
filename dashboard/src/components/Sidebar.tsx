'use client';

import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  return (
    <>
      {/* Sidebar - Glassmorphism style */}
      <aside
        className={`glass flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'
          }`}
        style={{
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">World of LifeOS</h1>
              <p className="text-sm text-gray-400 mt-0.5 tracking-tight">Canon Dashboard</p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-xl hover:bg-black/5 text-gray-400 hover:text-gray-600 transition-all duration-150 ${isCollapsed ? 'mx-auto' : ''
              }`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                // Expand icon (chevron right)
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              ) : (
                // Collapse icon (chevron left)
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              )}
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {/* World Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">World</div>
          )}
          <ul className="space-y-1">
            <li>
              <a
                href="/"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Overview' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!isCollapsed && <span>Overview</span>}
              </a>
            </li>
            <li>
              <a
                href="/thesis"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Thesis' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!isCollapsed && <span>Thesis</span>}
              </a>
            </li>
            <li>
              <a
                href="/setting"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? '2030 Setting' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isCollapsed && <span>2030 Setting</span>}
              </a>
            </li>
            <li>
              <a
                href="/questions"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Open Questions' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isCollapsed && <span>Open Questions</span>}
              </a>
            </li>
          </ul>

          {/* LifeOS Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">LifeOS</div>
          )}
          <ul className="space-y-1">
            <li>
              <a
                href="/domains"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'All Domains' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {!isCollapsed && <span>All Domains</span>}
              </a>
            </li>
          </ul>

          {/* PKG Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">Synthetic User</div>
          )}
          <ul className="space-y-1">
            <li>
              <a
                href="/pkg"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Marcus Chen (PKG)' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {!isCollapsed && <span>Marcus Chen</span>}
              </a>
            </li>
          </ul>

          {/* Scenarios Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">Testing</div>
          )}
          <ul className="space-y-1">
            <li>
              <a
                href="/scenarios"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Scenarios' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {!isCollapsed && <span>Scenarios</span>}
              </a>
            </li>
          </ul>
        </nav>

        <div className="border-t border-black/5">
          <a
            href="/versions"
            className={`nav-item flex items-center px-3 py-3 text-sm text-gray-600 hover:text-gray-900 group mx-3 my-2 ${isCollapsed ? 'justify-center mx-1' : ''
              }`}
            title={isCollapsed ? 'Versions' : ''}
          >
            <svg
              className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {!isCollapsed && <span>Versions</span>}
          </a>
          {!isCollapsed && (
            <div className="px-4 pb-4">
              <div className="text-xs text-gray-400">
                <span className="font-medium">API:</span> localhost:3001
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
