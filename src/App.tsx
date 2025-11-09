import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import MoviesDetail from './pages/MoviesDetail'


function App() {



return(

  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MoviesDetail />} />
  </Routes>

)
}

export default App
