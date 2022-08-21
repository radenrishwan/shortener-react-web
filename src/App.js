import './style/App.css';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import { endpoint } from './config/config.mjs';
import NotFound from './pages/NotFound';

function App() {
  const [valid, setValid] = useState(true)


  useEffect(() => {
    const location = window.location.pathname;

    if (location !== '/') {
      const alias = location.split("/")[1];

      fetch(`${endpoint}?alias=${alias}`, {
        method: 'GET',
      }).then(res => res.json()).then(data => {
        if (data.code === 200) {
          window.location.replace(`http://${data['data']['destination']}`)
        } else {
          setValid(false)
        }
      })
    }
  }, [])

  return (
    <div>
      {window.location.pathname === '/' ? <Home /> : <>
        {valid ? <></> : <NotFound />}
      </>}
    </div>
  );
}

export default App;
