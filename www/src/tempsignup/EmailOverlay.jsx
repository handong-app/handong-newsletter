import React, { useState, useEffect, useRef } from "react";
import { useSprings, animated, config } from "react-spring";
import "./EmailOverlay.css";
import emailIcon from "./email.png";

const iconSize = 40; // 아이콘 크기

// 화면 크기를 가져오는 헬퍼 함수
const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

function EmailOverlay({ displayedEmails = 3 }) {
  // displayedEmails prop 추가, 기본값 3
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const overlayRef = useRef(null);

  // displayedEmails가 변경될 때마다 initialStyles를 다시 계산합니다.
  const [initialStyles, setInitialStyles] = useState(() =>
    Array(displayedEmails)
      .fill({})
      .map(() => ({
        x:
          Math.random() * (windowDimensions.width - iconSize * 2) +
          iconSize / 2,
        y: windowDimensions.height - iconSize - Math.random() * 60,
        rotation: Math.random() * 120 - 60,
      }))
  );

  // displayedEmails prop이 변경되면 initialStyles를 업데이트합니다.
  useEffect(() => {
    setInitialStyles(
      Array(displayedEmails)
        .fill({})
        .map(() => ({
          x:
            Math.random() * (windowDimensions.width - iconSize * 2) +
            iconSize / 2,
          y: windowDimensions.height - iconSize - Math.random() * 60,
          rotation: Math.random() * 120 - 60,
        }))
    );
  }, [displayedEmails, windowDimensions]);

  const [springs, api] = useSprings(
    displayedEmails,
    (i) => ({
      from: {
        transform: `translateY(-250px) translateX(${
          initialStyles[i]
            ? initialStyles[i].x + (Math.random() - 0.5) * 50
            : Math.random() * windowDimensions.width
        }px) rotate(0deg)`,
        opacity: 0,
      },
      to: {
        transform: `translateX(${
          initialStyles[i] ? initialStyles[i].x : 0
        }px) translateY(${
          initialStyles[i] ? initialStyles[i].y : 0
        }px) rotate(${initialStyles[i] ? initialStyles[i].rotation : 0}deg)`,
        opacity: 1,
      },
      config: { ...config.gentle, mass: 1, tension: 120, friction: 14 },
      delay: i * 100 + Math.random() * 200,
    }),
    [initialStyles] // initialStyles를 의존성 배열에 추가
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);

    // document에 mousemove 이벤트 리스너 추가
    document.addEventListener("mousemove", handleMouseMove);
    // document에 mouseleave 이벤트 리스너 추가 (브라우저 창을 벗어났을 때 감지)
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      // 컴포넌트 언마운트 시 document에서 이벤트 리스너 제거
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []); // handleMouseMove, handleMouseLeave를 의존성 배열에서 제거하여 document에 한 번만 등록되도록 함

  const handleMouseMove = (e) => {
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    api.start((index) => {
      // initialStyles[index]가 존재할 때만 로직 실행
      if (!initialStyles[index]) return {};
      const { x, y, rotation } = initialStyles[index];
      // 아이콘의 중심점 계산
      const iconCenterX = x + iconSize / 2;
      const iconCenterY = y + iconSize / 2;

      const dx = mouseX - iconCenterX;
      const dy = mouseY - iconCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const interactionRadius = 120; // 마우스 상호작용 반경

      if (distance < interactionRadius) {
        const moveStrength = (interactionRadius - distance) / interactionRadius;
        // 마우스로부터 멀어지는 방향으로 이동
        const moveX = -(dx / distance) * moveStrength * 40; // 이동 강도 증가
        const moveY = -(dy / distance) * moveStrength * 40;
        // 랜덤한 추가 회전
        const newRotation =
          rotation + (Math.random() - 0.5) * 60 * moveStrength;

        return {
          transform: `translateX(${x + moveX}px) translateY(${
            y + moveY
          }px) rotate(${newRotation}deg)`,
          config: config.wobbly, // 좀 더 탄력있는 움직임
        };
      } else {
        // 마우스가 멀어지면 원래 위치로 부드럽게 복귀
        return {
          transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`,
          config: { ...config.gentle, tension: 150, friction: 20 },
        };
      }
    });
  };

  const handleMouseLeave = () => {
    // 마우스가 오버레이 영역을 벗어나면 모든 아이콘을 원래 위치로 되돌림
    api.start((index) => {
      // initialStyles[index]가 존재할 때만 로직 실행
      if (!initialStyles[index]) return {};
      return {
        transform: `translateX(${initialStyles[index].x}px) translateY(${initialStyles[index].y}px) rotate(${initialStyles[index].rotation}deg)`,
        config: { ...config.gentle, tension: 150, friction: 20 },
      };
    });
  };

  return (
    <div className="email-overlay" ref={overlayRef}>
      {springs.map((props, index) => (
        <animated.img
          key={index}
          src={emailIcon}
          alt="Email Icon"
          className="email-icon"
          style={{
            ...props,
            width: `${iconSize}px`,
            height: "auto",
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform, opacity", // 애니메이션 성능 최적화
          }}
        />
      ))}
    </div>
  );
}

export default EmailOverlay;
