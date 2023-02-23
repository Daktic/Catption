import React, {createContext} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



import PhotoPage from './pages/PhotoPage';
import LoginPage from './pages/LoginPage';
import DynamicPhoto from "./pages/DynamicPhoto";

const TokenContext = createContext(false);
function App() {
  return (
      <div >
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<PhotoPage />} />
                <Route path="/photo/:id" element={<DynamicPhoto />} />
                <Route path="/photo" element={<PhotoPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>

        </BrowserRouter>
      </div>
  );
}

export default App;
