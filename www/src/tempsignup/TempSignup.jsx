import React, { useEffect, useState, useRef } from "react"; // useRef 추가
import { useRive, Layout, Fit, Alignment } from "rive-react";
import "./TempSignup.css";
import emailImage from "./email.png";
import riveAnimation from "./rive.riv"; // rive.riv 파일 임포트

function TempSignup() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [emailValue, setEmailValue] = useState(""); // 이메일 입력 값을 위한 상태 추가
  const riveContainerRef = useRef(null); // Rive 컨테이너를 위한 ref 생성

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

  return (
    <div className="temp-signup-container">
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
        />
        <button>구독하기</button>
      </div>
    </div>
  );
}

export default TempSignup;
