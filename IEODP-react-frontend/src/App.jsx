import { useLocation } from "react-router-dom";
import Footer from "./layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import OfflineDetector from "./shared/OfflineDetector";
import Navbar from "./layout/Navbar";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className=" h-screen">
      {!shouldHideNavbar && <Navbar />}
      <div className="mt-14">
        <OfflineDetector />
        <ScrollToTop />
        <AppRoutes />
        <Footer />
     </div>
    </div>
  );
};

export default App;
