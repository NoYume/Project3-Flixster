import { Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesProvider.jsx";
import { ModalProvider } from "./context/ModalProvider.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import UniversalModal from "./components/UniversalModal.jsx";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import Favorites from "./pages/Favorites.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import NotFound from "./pages/NotFound.jsx";

// App shell (CLAUDE.md §4 / §5): backdrop, glass Nav, routed pages, Footer,
// and a route-independent modal portal.
const App = () => {
  return (
    <FavoritesProvider>
      <ModalProvider>
        <div className="app-bg" aria-hidden="true" />

        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex min-w-0 flex-1 flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>

        <UniversalModal />
      </ModalProvider>
    </FavoritesProvider>
  );
};

export default App;
