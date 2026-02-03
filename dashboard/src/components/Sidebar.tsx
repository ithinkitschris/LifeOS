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
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">LifeOS World</h1>
              <p className="text-sm text-gray-500 mt-1">Canon Dashboard</p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className="w-5 h-5"
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
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <a
                href="/thesis"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
                title={isCollapsed ? 'Thesis' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${
                    isCollapsed ? '' : 'mr-3'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {!isCollapsed && <span>Thesis</span>}
              </a>
            </li>
            <li>
              <a
                href="/setting"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
                title={isCollapsed ? '2030' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${
                    isCollapsed ? '' : 'mr-3'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {!isCollapsed && <span>2030</span>}
              </a>
            </li>
            <li>
              <a
                href="/domains"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
                title={isCollapsed ? 'LifeOS' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${
                    isCollapsed ? '' : 'mr-3'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                {!isCollapsed && <span>LifeOS</span>}
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="border-t border-gray-200">
          <a
            href="/versions"
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Versions' : ''}
          >
            <svg
              className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${
                isCollapsed ? '' : 'mr-3'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {!isCollapsed && <span>Versions</span>}
          </a>
          {!isCollapsed && (
            <div className="px-4 pb-4">
              <div className="text-xs text-gray-500">
                <span className="font-medium">API:</span> localhost:3001
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
