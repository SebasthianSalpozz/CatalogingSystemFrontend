import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ListPage } from "./pages/ListPage";
import { EditPage } from "./pages/EditPage";
import { CreatePage } from "./pages/CreatePage";
import { TenantListPage } from "./pages/TenantListPage";
import { CreateTenantPage } from "./pages/CreateTenantPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TenantListPage />} />
        <Route path="/tenants" element={<TenantListPage />} />
        <Route path="/createTenant" element={<CreateTenantPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/createAdministrativeFile" element={<CreatePage />} />
        <Route path="/editAdministrativeFile/:expediente" element={<EditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;