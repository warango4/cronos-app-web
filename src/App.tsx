import {Route, Routes} from 'react-router';
import Layout from './components/Layout';
import AlarmDetail from './screens/AlarmDetail';
import AlarmList from './screens/AlarmList';
import Monitor from './screens/Monitor';
import NewAlarm from './screens/NewAlarm';
import Requests from './screens/Requests';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<AlarmList />} />
        <Route path="nueva" element={<NewAlarm />} />
        <Route path="alarma/:id" element={<AlarmDetail />} />
        <Route path="monitorear" element={<Monitor />} />
        <Route path="solicitudes" element={<Requests />} />
      </Route>
    </Routes>
  );
}
