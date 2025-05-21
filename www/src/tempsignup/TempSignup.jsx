import React, { useEffect, useState, useRef } from "react"; // useRef 추가
import { useRive, Layout, Fit, Alignment } from "rive-react";
import { Toaster, toast } from "react-hot-toast"; // react-hot-toast 추가
import "./TempSignup.css";
import emailImage from "./email.png";
import riveAnimation from "./rive.riv"; // rive.riv 파일 임포트
import EmailOverlay from "./EmailOverlay";

function TempSignup() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [emailValue, setEmailValue] = useState(""); // 이메일 입력 값을 위한 상태 추가
  const [mailLoading, setMailLoading] = useState(false); // 이메일 로딩 상태 추가
  const [currentNumberOfEmails, setCurrentNumberOfEmails] = useState(3); // 표시할 이메일 아이콘 수 상태 추가
  const riveContainerRef = useRef(null); // Rive 컨테이너를 위한 ref 생성
  const emailInputRef = useRef(null); // 이메일 입력을 위한 ref 생성

  const { rive, RiveComponent } = useRive({
    src: riveAnimation,
    stateMachines: "Sniff Rig",
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    autoBind: true, // autoBind가 true인지 확인
    onLoad: () => {
      console.log("Rive file loaded");
      setIsLoaded(true);
    },
    // onError 콜백을 추가하여 로딩 중 에러가 있는지 확인할 수 있습니다.
    onError: (error) => {
      console.error("Rive loading error:", error);
    },
  });

  useEffect(() => {
    if (rive && isLoaded) {
      const inputs = rive.stateMachineInputs("Sniff Rig");
      if (inputs) {
        const trackingInput = inputs.find(
          (input) => input.name === "isTracking"
        );
        if (trackingInput) {
          trackingInput.value = true;
        }
      }
    }
  }, [rive, isLoaded]);

  useEffect(() => {
    // 이메일 입력 값에 따라 isArms 상태를 변경하는 useEffect
    if (rive && isLoaded) {
      const inputs = rive.stateMachineInputs("Sniff Rig");
      if (inputs) {
        const isArmsInput = inputs.find((input) => input.name === "isArms");
        if (isArmsInput) {
          isArmsInput.value = emailValue.includes("@");
        }
      }

      if (emailValue.includes("@")) {
        const posYInput = inputs.find((input) => input.name === "posY"); // posY 입력 찾기
        if (posYInput) {
          posYInput.value = 100;
        }
      }
    }
  }, [rive, isLoaded, emailValue]); // emailValue를 의존성 배열에 추가

  useEffect(() => {
    // Rive 인스턴스가 준비되고, 파일이 로드되었으며, 컨테이너 ref가 설정된 경우에만 실행
    if (rive && isLoaded && riveContainerRef.current) {
      const canvasElement = riveContainerRef.current.querySelector("canvas");

      if (canvasElement) {
        const handleMouseMove = (event) => {
          const rect = canvasElement.getBoundingClientRect();
          // 마우스 X 위치를 캔버스 기준으로 계산합니다.
          const mouseXRelativeToCanvas = event.clientX - rect.left;
          const canvasWidth = rect.width;
          let posXValue = (mouseXRelativeToCanvas / canvasWidth) * 100;

          // 마우스 Y 위치를 캔버스 기준으로 계산합니다.
          const mouseYRelativeToCanvas = event.clientY - rect.top;
          const canvasHeight = rect.height;
          let posYValue = (mouseYRelativeToCanvas / canvasHeight) * 100;

          const inputs = rive.stateMachineInputs("Sniff Rig");
          if (inputs) {
            const posXInput = inputs.find((input) => input.name === "posX");
            if (posXInput) {
              posXInput.value = posXValue;
            }
            const posYInput = inputs.find((input) => input.name === "posY"); // posY 입력 찾기
            if (posYInput) {
              if (emailValue.includes("@")) {
                posYInput.value = 100; // "@" 포함 시 posY를 100으로 고정
              } else {
                posYInput.value = 100 - posYValue; // 기존 로직 (마우스 Y 위치 기반)
              }
            } else {
              // console.warn("posY input not found in 'Sniff Rig' state machine.");
            }
          }
        };

        document.addEventListener("mousemove", handleMouseMove);

        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
        };
      } else {
        console.warn(
          "Canvas element NOT found in riveContainerRef. Current rive.renderer.canvas:",
          rive.renderer ? rive.renderer.canvas : "renderer undefined"
        );
      }
    }
  }, [rive, isLoaded, emailValue]); // emailValue를 의존성 배열에 추가

  useEffect(() => {
    // 컴포넌트 마운트 시 이메일 입력 필드에 포커스
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  const handleSubscribe = async () => {
    if (!emailValue || !emailValue.includes("@")) {
      toast.error("유효한 이메일을 입력해주세요.");
      return;
    }

    setMailLoading(true); // 이메일 로딩 상태 설정

    if (rive) {
      const inputs = rive.stateMachineInputs("Sniff Rig");
      const isSniffingInput = inputs.find(
        (input) => input.name === "isSniffing"
      );
      if (isSniffingInput) {
        isSniffingInput.value = true;
      }
    }

    // 최소 2초 대기
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // 여기에 실제 구독 요청 로직을 추가합니다.
      // 예: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email: emailValue }) });
      const subscribedEmail = emailValue; // 토스트에 현재 이메일 값을 표시하기 위해 저장
      console.log("구독 요청:", subscribedEmail);
      setEmailValue(""); // 구독 후 이메일 입력 필드 초기화
      toast.success(`${subscribedEmail} (으)로 구독 요청이 완료되었습니다!`);
      setCurrentNumberOfEmails((prevCount) => prevCount + 1); // 이메일 아이콘 수 증가
    } catch (error) {
      console.error("구독 요청 실패:", error);
      toast.error("구독 요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      if (rive) {
        const inputs = rive.stateMachineInputs("Sniff Rig");
        const isSniffingInput = inputs.find(
          (input) => input.name === "isSniffing"
        );
        if (isSniffingInput) {
          isSniffingInput.value = false;
        }
        setMailLoading(false); // 이메일 로딩 상태 해제
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <div className="temp-signup-container">
      <Toaster
        toastOptions={{
          style: {
            maxWidth: "100%", // 최대 너비를 100%로 설정
            whiteSpace: "nowrap", // 줄 바꿈 방지
            overflow: "hidden", // 내용이 넘칠 경우 숨김
            textOverflow: "ellipsis", // 내용이 넘칠 경우 말줄임표 표시
          },
        }}
      />
      <div className="left-panel">
        <img src={emailImage} alt="Email" className="bouncing-email" />
      </div>
      <div className="right-panel">
        {/* RiveComponent를 감싸는 div에 ref를 할당합니다. */}
        <div className="rive-animation-container" ref={riveContainerRef}>
          <RiveComponent style={{ width: "100%", height: "100%" }} />
        </div>
        <h2>새로운 소식을 받아보세요!</h2>
        <input
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)} // onChange 핸들러 추가
          onKeyDown={handleKeyDown} // onKeyDown 핸들러 추가
          ref={emailInputRef} // ref 할당
          disabled={mailLoading}
        />
        <button disabled={mailLoading} onClick={handleSubscribe}>
          구독하기
        </button>
      </div>
      <EmailOverlay displayedEmails={currentNumberOfEmails} />
    </div>
  );
}

export default TempSignup;
