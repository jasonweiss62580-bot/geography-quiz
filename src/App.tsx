import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from './pages/HomeScreen/HomeScreen';
import { ModeSelect } from './pages/ModeSelect/ModeSelect';
import { FormatSelect } from './pages/FormatSelect/FormatSelect';
import { QuizSession } from './pages/QuizSession/QuizSession';
import { Results } from './pages/Results/Results';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/topic/:topicId/mode" element={<ModeSelect />} />
        <Route path="/topic/:topicId/mode/:modeId/format" element={<FormatSelect />} />
        <Route path="/quiz" element={<QuizSession />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
