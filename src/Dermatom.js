import './App.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import 'react-toastify/dist/ReactToastify.css';
import { HashRouter as Router } from 'react-router-dom';
import Header from './components/header/Header';
import DataContextProvider from './hooks/data-manager/DataContext';
import Routes from './routes/Routes';

function Dermatom() {
  return (
    <DataContextProvider>
      <Router>
        <Header />
        { /*<main>
          <div className="container h-100">
            <div className="row h-100">
        <div className="col-12 h-100 d-flex flex-column"> */ }
        <Routes />
        { /*</div>
            </div>
          </div>
              </main> */ }
      </Router>
    </DataContextProvider>
  );
}

export default Dermatom;
