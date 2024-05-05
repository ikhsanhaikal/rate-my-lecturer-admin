import { Admin, CustomRoutes, Resource } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import engMessages from "ra-language-english";

import { BrowserRouter, Route } from "react-router-dom";
import authProvider from "./auth-provider";
import client from "./auth-client";
import { useEffect, useState } from "react";
import { dataProvider } from "./data-provider";
import LecturerList from "./components/lecturers/lecturers.list";
import LecturerShow from "./components/lecturers/lecturers.show";
import LabList from "./components/labs/labs.list";
import LabShow from "./components/labs/labs.show";
import LecturerCreate from "./components/lecturers/lecturers.create";
import LabCreate from "./components/labs/labs.create";
import SubjectList from "./components/subjects/subject.list";
import SubjectCreate from "./components/subjects/subject.create";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LecturerEdit from "./components/lecturers/lecturers.edit";
import SubjectEdit from "./components/subjects/subject.edit";
import CourseEdit from "./components/courses/courses.edit";
const Profile = () => {
  const [token, setToken] = useState("");
  useEffect(() => {
    (async () => {
      const token = await client.getTokenSilently();
      setToken(token);
    })();
  }, []);

  return (
    <div>
      <p>Token: {token}</p>
      <button
        onClick={async () => {
          const token = await client.getTokenSilently();
          setToken(token);
        }}
      >
        refresh
      </button>
    </div>
  );
};

const i18nProvider = polyglotI18nProvider(() => engMessages, "en", {
  allowMissing: true,
  onMissingKey: (key, _, __) => key,
});

function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Admin
          disableTelemetry
          i18nProvider={i18nProvider}
          authProvider={authProvider}
          dataProvider={dataProvider}
          requireAuth={true}
        >
          {(permissions) => {
            {
              /* <Admin i18nProvider={i18nProvider} dataProvider={dataProvider}> */
            }
            return (
              <>
                <CustomRoutes>
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="/lecturers/:id/courses/create"
                    element={<LecturerShow />}
                  />
                  <Route
                    path="/lecturers/:id/courses/:cid/edit"
                    element={<CourseEdit />}
                  />
                </CustomRoutes>
                <Resource
                  name="lecturers"
                  list={LecturerList}
                  show={LecturerShow}
                  edit={LecturerEdit}
                  create={LecturerCreate}
                />
                <Resource
                  name="labs"
                  list={LabList}
                  show={LabShow}
                  create={LabCreate}
                  edit={<>Edit labs page</>}
                />
                <Resource
                  name="subjects"
                  list={SubjectList}
                  create={SubjectCreate}
                  edit={SubjectEdit}
                />
                {permissions === "admin" ? (
                  <Resource name="test" list={<></>} />
                ) : null}
              </>
            );
          }}
        </Admin>
      </LocalizationProvider>
    </BrowserRouter>
  );
}

export default App;
