import { PageLayout } from '../../components/layout/PageLayout/PageLayout';
import { useSettingsStore } from '../../stores/settingsStore';
import styles from './SettingsScreen.module.css';

export function SettingsScreen() {
  const { questionCount, showTimer, allowClose, setQuestionCount, setShowTimer, setAllowClose } =
    useSettingsStore();

  return (
    <PageLayout title="Settings">
      <div className={styles.wrapper}>
        <div className={styles.panel}>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="qcount">
              Questions per Quiz
            </label>
            <div className={styles.control}>
              <input
                id="qcount"
                type="number"
                className={styles.countInput}
                value={questionCount}
                min={1}
                max={50}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
              />
              <span className={styles.hint}>(1–50)</span>
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Show Timer</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
              />
              {showTimer ? 'On' : 'Off'}
            </label>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Accept Close Spelling</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={allowClose}
                onChange={(e) => setAllowClose(e.target.checked)}
              />
              {allowClose ? 'On' : 'Off'}
            </label>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
