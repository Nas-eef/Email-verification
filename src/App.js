
import './App.css';
import EmailVerification from './Pages/EmailVerification';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Verify from './Pages/Verify';
import LoginHome from './Pages/LoginHome';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' index element={<EmailVerification/>}></Route>
    <Route path='/verify/:token' element={<Verify />} />
    <Route path='/LoginHome' element={<LoginHome />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
