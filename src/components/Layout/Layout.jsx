import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import CustomCursor from '../CustomCursor/CustomCursor';
import BackgroundIcons from '../BackgroundIcons';
const Layout = () => (
  <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <BackgroundIcons />
    <CustomCursor />
    <Header />
    <main id="main-content"><Outlet /></main>
    <Footer />
  </div>
);
export default Layout;
