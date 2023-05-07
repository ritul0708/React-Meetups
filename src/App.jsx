import { Route, Routes } from 'react-router-dom';

import AllMeetupsPage from './pages/AllMeetups';
import NewMeetupPage from './pages/NewMeetup';
import Favorites from './pages/Favorites';
import Layout from './components/layout/Layout';
import Signup from './components/signup/Signup';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<AllMeetupsPage />} />
        <Route path='/new-meetup' element={<NewMeetupPage />} />
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Layout>
  );
}

export default App;