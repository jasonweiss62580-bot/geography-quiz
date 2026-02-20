import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from './pages/HomeScreen/HomeScreen';
import { ModeSelect } from './pages/ModeSelect/ModeSelect';
import { FormatSelect } from './pages/FormatSelect/FormatSelect';
import { QuizSession } from './pages/QuizSession/QuizSession';
import { Results } from './pages/Results/Results';
import { SettingsScreen } from './pages/SettingsScreen/SettingsScreen';
import { WorldModeSelect } from './pages/WorldModeSelect/WorldModeSelect';
import { WorldFormatSelect } from './pages/WorldFormatSelect/WorldFormatSelect';
import { WorldQuizSession } from './pages/WorldQuizSession/WorldQuizSession';
import { WorldResults } from './pages/WorldResults/WorldResults';
import { WorldSettingsScreen } from './pages/WorldSettingsScreen/WorldSettingsScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── US States ── */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/topic/:topicId/mode" element={<ModeSelect />} />
        <Route path="/topic/:topicId/mode/:modeId/format" element={<FormatSelect />} />
        <Route path="/quiz" element={<QuizSession />} />
        <Route path="/results" element={<Results />} />
        <Route path="/settings" element={<SettingsScreen />} />

        {/* ── World Geography ── */}
        <Route path="/world" element={<WorldModeSelect />} />
        <Route path="/world/mode/:modeId/format" element={<WorldFormatSelect />} />
        <Route path="/world/quiz" element={<WorldQuizSession />} />
        <Route path="/world/results" element={<WorldResults />} />
        <Route path="/world/settings" element={<WorldSettingsScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
