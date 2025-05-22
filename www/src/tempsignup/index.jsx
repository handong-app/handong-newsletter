import React, { useState, useEffect } from "react";
import TempSignup from "./TempSignup"; // TempSignup 컴포넌트 임포트
import "./TempSignupPage.css"; // 스타일 파일을 위한 임포트 (새로 생성 필요)

function TempSignupPage() {
  const [apiKey, setApiKey] = useState("");
  const [storedApiKey, setStoredApiKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const keyFromStorage = localStorage.getItem("news_apikey");
    setStoredApiKey(keyFromStorage);
    setIsLoading(false);
  }, []);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim() !== "") {
      localStorage.setItem("news_apikey", apiKey);
      window.location.reload(); // 페이지 새로고침
    } else {
      alert("API 키를 입력해주세요.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleApiKeySubmit();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로컬 스토리지 확인 중 로딩 표시
  }

  if (!storedApiKey) {
    return (
      <div className="api-key-input-container">
        <h2>뉴스 API 키 입력</h2>
        <p>
          Handong Newsletter 서비스를 이용하려면 NewsAPI의 API 키가 필요합니다.
        </p>
        <p>API 키는 관리자가 보유하고 있습니다.</p>
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          onKeyPress={handleKeyPress}
          placeholder="API 키를 입력하세요"
          className="api-key-input"
        />
        <button onClick={handleApiKeySubmit} className="api-key-submit-button">
          저장하고 새로고침
        </button>
      </div>
    );
  }

  return <TempSignup apiKey={storedApiKey} />;
}

export default TempSignupPage;
