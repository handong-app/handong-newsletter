import "./App.css";
import Login from "./Login";
import { firebaseApp } from "./firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import MainSub from "./MainSub";

function App() {
  const auth = getAuth(firebaseApp);
  const [user, loading] = useAuthState(auth);

  // Loading the Firebase Auth
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="App">
      <h1 className="title">한동 뉴스레터</h1>
      {user ? <MainSub /> : <Login />}
    </div>
  );
}

export default App;
