import React, { useState } from 'react';
import {
  ChartPieIcon,
  ViewBoardsIcon,
  InboxIcon,
  UserIcon,
  ShoppingBagIcon,
  ArrowSmRightIcon,
  TableIcon,
  BookOpenIcon 
} from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r transition-width duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>Dashboard</span>
          <button onClick={toggleSidebar} className="text-gray-600">
            {collapsed ? '>' : '<'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-2 space-y-2 mt-4">
          <SidebarItem
            icon={ChartPieIcon}
            label="Dashboard"
            href="/"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={ViewBoardsIcon}
            label="Information"
            href="/table"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={UserIcon}
            label="Add Users"
            href="/createusers"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={BookOpenIcon}
            label="Books"
            href="/bookfile"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={TableIcon}
            label="Reports"
            href="/notfoundpage"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={InboxIcon}
            label="Messages"
            href="/notfoundpage"
            collapsed={collapsed}
            
          />
        </nav>

        {/* Bottom Navigation */}
        <div className="px-2 py-4 border-t">
          {user && (
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <ArrowSmRightIcon className={`w-6 h-6 ${collapsed ? 'mx-auto' : 'mr-3'} text-gray-500`} />
              {!collapsed && <span>Logout</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon: Icon, label, href, collapsed, badge }) {
  return (
    <a
      href={href}
      className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md`}
    >
      <Icon className={`w-6 h-6 ${collapsed ? 'mx-auto' : 'mr-3'} text-gray-500`} />
      {!collapsed && (
        <span className="flex-1">
          {label}
          {badge && (
            <span className="ml-2 text-sm font-medium text-white bg-blue-500 rounded-full px-2 py-0.5">
              {badge}
            </span>
          )}
        </span>
      )}
    </a>
  );
}
