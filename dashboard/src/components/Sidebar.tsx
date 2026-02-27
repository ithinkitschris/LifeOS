'use client';

import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Read localStorage after hydration to avoid server/client mismatch
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') setIsCollapsed(true);
  }, []);

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
              <h1 className="text-2xl font-medium text-gray-900 tracking-tight -ml-0.5">LifeOS</h1>
              <p className="text-sm text-gray-400 mt-0.5 tracking-tight">Research Platform</p>
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

          {/* Simulate Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Simulate</div>
          )}
          <ul className="space-y-1">
            <li>
              <a
                href="/simulate"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Simulation Runner' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isCollapsed && <span>Simulation Runner</span>}
              </a>
            </li>
            <li>
              <a
                href="/vignettes"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Vignettes' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!isCollapsed && <span>Vignettes</span>}
              </a>
            </li>
            <li>
              <a
                href="/findings"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Findings' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!isCollapsed && <span>Findings</span>}
              </a>
            </li>
          </ul>

          {/* World Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">World</div>
          )}
          <ul className="space-y-1">
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
                href="/domains"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Life Domains' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {!isCollapsed && <span>Life Domains</span>}
              </a>
            </li>
            <li>
              <a
                href="/mode-intent-framework"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Mode–Intent Framework' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                {!isCollapsed && <span>Mode–Intent Framework</span>}
              </a>
            </li>
            <li>
              <a
                href="/ecosystem"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Multimodal Ecosystem' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                </svg>
                {!isCollapsed && <span>Multimodal Ecosystem</span>}
              </a>
            </li>
            <li>
              <a
                href="/architecture"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'System Architecture' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                </svg>
                {!isCollapsed && <span>System Architecture</span>}
              </a>
            </li>
          </ul>

          {/* Knowledge Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">Knowledge</div>
          )}
          <ul className="space-y-1">
            <li>
              <a
                href="/knowledge"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'PKG Overview' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm4 0h8M8 11h8M8 15h5" />
                </svg>
                {!isCollapsed && <span>PKG Overview</span>}
              </a>
            </li>
          </ul>

          {/* Thesis Section */}
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">Thesis</div>
          )}
          <ul className="space-y-1">
            <li>
              <a
                href="/thesis"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Structure' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!isCollapsed && <span>Structure</span>}
              </a>
            </li>
            <li>
              <a
                href="/prototypes"
                className={`nav-item flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 group ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Work in Progress' : ''}
              >
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {!isCollapsed && <span>Work in Progress</span>}
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
        </div>
      </aside>
    </>
  );
}
