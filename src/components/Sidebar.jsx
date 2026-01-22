import React from 'react';
import { Utensils } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, Users, UserCircle, LogOut, Activity } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/history", icon: History, label: "History" },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/profile", icon: UserCircle, label: "Profile" },
    { to: "/diet", icon: Utensils, label: "Nutrition" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Activity size={32} color="#8b5cf6" />
        <h1>PetPlus</h1>
      </div>

      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <link.icon size={22} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button onClick={onLogout} className="logout-btn">
        <LogOut size={20} />
        <span>Log Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;