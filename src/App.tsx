import AuthGate from './AuthGate';
import ClickFx from './ClickFx';
import LiveBackground from './LiveBackground';
import Protect from './Protect';
import Shop from './Shop';

function App() {
  return (
    <>
      <LiveBackground />
      <Protect />
      <ClickFx />
      <AuthGate>
        <Shop />
      </AuthGate>
    </>
  );
}

export default App;
