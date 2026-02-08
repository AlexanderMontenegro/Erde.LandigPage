import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import './styles/theme.css'; // Mantiene dark mode

export default function App() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}