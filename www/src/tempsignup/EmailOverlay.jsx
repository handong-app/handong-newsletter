import React, { useState, useEffect, useRef } from "react";
import Matter from "matter-js";
import "./EmailOverlay.css";
import emailIcon from "./email.png";

const iconSize = 40; // 아이콘 크기 (물리 객체의 반경과 관련)

// 화면 크기를 가져오는 헬퍼 함수
const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

function EmailOverlay({ displayedEmails = 3 }) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const sceneRef = useRef(null); // Matter.js 렌더러를 위한 ref
  const engineRef = useRef(Matter.Engine.create());
  const runnerRef = useRef(Matter.Runner.create());
  const [bodies, setBodies] = useState([]); // 물리 객체들의 상태를 저장

  // Matter.js 초기 설정
  useEffect(() => {
    const engine = engineRef.current;
    engine.gravity.y = 0.5; // 중력 설정 (아래 방향으로) - 최신 방식
    const runner = runnerRef.current;

    // 벽 생성 (화면 경계)
    const wallOptions = { isStatic: true, restitution: 0.5, friction: 0.1 };
    Matter.World.add(engine.world, [
      // 바닥
      Matter.Bodies.rectangle(
        windowDimensions.width / 2,
        windowDimensions.height + iconSize / 2, // 바닥을 화면 약간 아래에 위치시켜 아이콘이 완전히 사라지지 않게
        windowDimensions.width,
        iconSize,
        wallOptions
      ),
      // 왼쪽 벽
      Matter.Bodies.rectangle(
        -iconSize / 2,
        windowDimensions.height / 2,
        iconSize,
        windowDimensions.height,
        wallOptions
      ),
      // 오른쪽 벽
      Matter.Bodies.rectangle(
        windowDimensions.width + iconSize / 2,
        windowDimensions.height / 2,
        iconSize,
        windowDimensions.height,
        wallOptions
      ),
    ]);

    // 물리 엔진 실행
    Matter.Runner.run(runner, engine);

    // 아이콘 상태 업데이트 루프
    const updateInterval = setInterval(() => {
      const currentBodies = engine.world.bodies
        .filter((body) => body.label === "email-icon") // 아이콘만 필터링
        .map((body) => ({
          id: body.id,
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        }));
      setBodies(currentBodies);
    }, 1000 / 60); // 60 FPS

    return () => {
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      clearInterval(updateInterval);
    };
  }, [windowDimensions]); // windowDimensions 변경 시 엔진 재설정

  // displayedEmails prop 변경 시 아이콘 추가/제거
  useEffect(() => {
    const engine = engineRef.current;
    const existingIcons = engine.world.bodies.filter(
      (body) => body.label === "email-icon"
    );

    if (displayedEmails > existingIcons.length) {
      // 아이콘 추가
      for (let i = 0; i < displayedEmails - existingIcons.length; i++) {
        const x =
          Math.random() * (windowDimensions.width - iconSize) + iconSize / 2;
        // 시작 y 위치를 화면 상단으로, 약간의 랜덤성을 줌
        const y = -Math.random() * 100 - iconSize;
        const newIcon = Matter.Bodies.circle(x, y, iconSize / 2, {
          label: "email-icon",
          restitution: 0.6, // 탄성 (바운스)
          friction: 0.05, // 마찰
          density: 0.01, // 밀도
          angle: Math.random() * Math.PI * 2, // 초기 랜덤 회전
        });
        Matter.World.add(engine.world, newIcon);
      }
    } else if (displayedEmails < existingIcons.length) {
      // 아이콘 제거 (가장 오래된 아이콘부터)
      const iconsToRemove = existingIcons.slice(
        0,
        existingIcons.length - displayedEmails
      );
      Matter.World.remove(engine.world, iconsToRemove);
    }
  }, [displayedEmails, windowDimensions]); // windowDimensions도 의존성에 추가

  // 마우스 상호작용
  useEffect(() => {
    const engine = engineRef.current;

    const handleMouseMove = (event) => {
      const mousePosition = { x: event.clientX, y: event.clientY };
      engine.world.bodies.forEach((body) => {
        if (body.label === "email-icon") {
          const distance = Matter.Vector.magnitude(
            Matter.Vector.sub(mousePosition, body.position)
          );
          if (distance < iconSize * 2) {
            // 마우스 근처 아이콘에만 영향
            const forceMagnitude = 0.0005 * body.mass; // 힘의 크기
            const force = Matter.Vector.mult(
              Matter.Vector.normalise(
                Matter.Vector.sub(body.position, mousePosition)
              ), // 마우스로부터 멀어지는 방향
              forceMagnitude
            );
            Matter.Body.applyForce(body, body.position, force);
          }
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [windowDimensions]); // windowDimensions 변경 시 마우스 제약 조건 재설정

  // 창 크기 변경 핸들러
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      // 참고: Matter.js 월드 및 바디 크기 조정 로직은 복잡할 수 있으며,
      // 여기서는 단순화를 위해 전체 엔진을 재설정하는 방향으로 접근했습니다.
      // 프로덕션 환경에서는 더 정교한 리사이즈 처리가 필요할 수 있습니다.
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={sceneRef} className="email-overlay">
      {bodies.map((body) => (
        <img
          key={body.id}
          src={emailIcon}
          alt="Email Icon"
          className="email-icon"
          style={{
            position: "absolute",
            left: `${body.x - iconSize / 2}px`,
            top: `${body.y - iconSize / 2}px`,
            width: `${iconSize}px`,
            height: "auto",
            transform: `rotate(${body.angle}rad)`,
            willChange: "transform, left, top", // 애니메이션 성능 최적화
          }}
        />
      ))}
    </div>
  );
}

export default EmailOverlay;
