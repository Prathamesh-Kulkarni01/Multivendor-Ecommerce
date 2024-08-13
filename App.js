import Routes from "./src/routes/Routes";
import { Provider } from 'react-redux';
import store from "./src/states/store";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

export default function App() {
  console.reportErrorsAsExceptions = false;
  return (
    <Provider store={store}>
        <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <Routes />
        </ApplicationProvider>
    </Provider>
  );
}

