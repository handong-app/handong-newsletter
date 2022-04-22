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
      <div className="suffix">
        <div>
          본 프로젝트는 한동대학교와 아무런 연관이 없으며
          <br />
          한동대학교 재학생이 직접 제작하여 관리하는 프로젝트입니다.
        </div>
        <div>
          <a
            href="https://github.com/junglesub/handong-newsletter"
            rel="noopener noreferrer"
            target="_blank"
          >
            [ 오픈소스 ]
          </a>
          &nbsp;&nbsp;
          <a href="/form" rel="noopener noreferrer" target="_blank">
            [ 구글폼(피드백/문의) ]
          </a>
          <br />© {new Date().getFullYear()} 한동 뉴스레터
        </div>
      </div>
    </div>
  );
}

export default App;
