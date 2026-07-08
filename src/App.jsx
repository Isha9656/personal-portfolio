import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout/Layout';

import Home from './pages/Home';
import Home2 from './pages/Home2';
import Home3 from './pages/Home3';
import Home4 from './pages/Home4';
import Landing from './pages/Landing';
import Page404 from './components/404/Page404';
import BlogDetails from './components/Blog/BlogDetails';
import ProjectDetails from './pages/ProjectDetails';
import EventDetails from './pages/EventDetails';
import Aos from 'aos';
import 'aos/dist/aos.css';
import LandingLayout from './components/Layout/LandingLayout';
import Layout2 from './components/Layout/Layout2';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  useEffect(() => {
    Aos.init({ once: true });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home-v3" element={<Home3 />} />
          <Route path="home-v4" element={<Home4 />} />
          <Route path="*" element={<Page404 />} />
          <Route path="blog/blog-details" element={<BlogDetails />} />
          <Route path="project/:id" element={<ProjectDetails />} />
          <Route path="event/:id" element={<EventDetails />} />
        </Route>
        <Route path="/home-v2" element={<Layout2 />}>
          <Route index element={<Home2 />} />
        </Route>
        <Route path="/landing" element={<LandingLayout />}>
          <Route index element={<Landing />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
