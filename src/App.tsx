import AuthGate from './AuthGate';
import ClickFx from './ClickFx';
import LiveBackground from './LiveBackground';
import Shop from './Shop';

function App() {
  return (
    <>
      <LiveBackground />
      <ClickFx />
      <AuthGate>
        <Shop />
      </AuthGate>
    </>
  );
}

export default App;
