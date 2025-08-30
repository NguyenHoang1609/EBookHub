import './App.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import RouteIndex from './route/RouteIndex.js'

function App() {

  return (

    <div className="App">
      {/* <Scrollbar style={{ width: "100%", height: "100vh" }}> */}
      <RouteIndex></RouteIndex>
      <ToastContainer position="bottom-right"  //de hien thi thanh thong bao
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* </Scrollbar> */}
    </div>

  );
}

export default App;
