import React from 'react';
import AdminLayout from '../components/Admin/AdminLayout';

/**
 * Admin page — simply renders the full AdminLayout.
 * Auth + protection is handled by ProtectedRoute in App.jsx.
 * Data is loaded from DataContext (initialized in main.jsx).
 */
const Admin = () => <AdminLayout />;

export default Admin;
