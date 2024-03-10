import { Admin, CustomRoutes, Resource} from 'react-admin'
import polyglotI18nProvider from "ra-i18n-polyglot";
import engMessages from "ra-language-english";

import { BrowserRouter, Route } from 'react-router-dom';
import authProvider from './auth-provider';
import client from './auth-client';
import { useEffect, useState } from 'react';
import { dataProvider } from './data-provider';
import LecturerList from './components/lecturers/list';
import LecturerShow from './components/lecturers/show';

const Profile =  () => {
  const [token, setToken] = useState('')
  useEffect(() => {
    (async () => {
      const token = await client.getTokenSilently()
      setToken(token)
    })()
  }, [])

  return (
    <div>
        <p>Token: {token}</p>
            <button onClick={async () => {
              const token = await client.getTokenSilently()
              setToken(token)
            }}>refresh</button>
    </div>
  )
}

const i18nProvider = polyglotI18nProvider((locale) => engMessages, "en", {
  allowMissing: true,
  onMissingKey: (key, _, __) => key,
});

function App(){
  return (
  <BrowserRouter>
    {/* <Admin  i18nProvider={i18nProvider} authProvider={authProvider} requireAuth={true}> */}
    <Admin  i18nProvider={i18nProvider} dataProvider={dataProvider}>
        <CustomRoutes>
          <Route path='/profile' element={<Profile />} />
        </CustomRoutes>
        <Resource name="lecturers" list={LecturerList} show={LecturerShow}/>
    </Admin>
  </BrowserRouter>
  )
}

export default App;