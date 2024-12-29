import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Landing} from './pages/Landing'; 
import { Navigate } from "react-router-dom";  
import {SignIn} from './pages/SignIn';     
import {SignUp} from './pages/SignUp';    
import Dashboard from './pages/Dashboard'; 
import {TaskDetails} from './pages/TaskDetails'; 
import Navbar from './components/Navbar'; 
import { TaskList } from './pages/TaskList'; 
import { ErrorPage } from './pages/ErrorPage';      
import {Footer} from './components/Footer';    
import PrivateRoute from './components/PrivateRoute';  
import { TaskStatistics } from './components/TaskStatistics';   
import './App.css';
import { TaskForm } from './components/TaskForm';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  return (
    <Router>
      <div className="app">
        {isAuthenticated() && <Navbar />}
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Landing />}/>
          <Route path="/signin" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <SignIn />}/>
          <Route path="/signup" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <SignUp />}/>
          
          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Dashboard} />}/>
          <Route path="/tasks" element={<PrivateRoute isAuthenticated={isAuthenticated} component={TaskList} />}/>
          <Route path="/tasks/:id" element={<PrivateRoute isAuthenticated={isAuthenticated} component={TaskDetails} />}/>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
    // <div>
    //   <Router>
    //     <Routes>
    //       <Route path='/' element={<Dashboard/>}/>
    //       <Route path="*" element={<ErrorPage />} />
    //     </Routes>
    //   </Router>
     
    // </div>
  );
}

export default App;