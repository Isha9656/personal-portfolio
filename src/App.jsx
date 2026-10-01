import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/Layout/Layout';

const Home = lazy(() => import('./pages/Home'));
const Home2 = lazy(() => import('./pages/Home2'));
const Home3 = lazy(() => import('./pages/Home3'));
const Home4 = lazy(() => import('./pages/Home4'));
const Landing = lazy(() => import('./pages/Landing'));
const Page404 = lazy(() => import('./components/404/Page404'));
const BlogDetails = lazy(() => import('./components/Blog/BlogDetails'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
import Aos from 'aos';
import 'aos/dist/aos.css';
import LandingLayout from './components/Layout/LandingLayout';
import Layout2 from './components/Layout/Layout2';
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
import ProtectedRoute from './components/Admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  useEffect(() => {
    Aos.init({ once: true });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
      <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
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
        <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
