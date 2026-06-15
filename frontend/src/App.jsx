import AppRoutes from "./routes/AppRoutes";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return <AppRoutes />;
}

<Route
  path="/admin-login"
  element={<AdminLogin />}
/>
export default App;