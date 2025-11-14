import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface SpinImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName: string;
  theme: "light" | "dark";
}

export function SpinImageModal({ isOpen, onClose, imageUrl, imageName, theme }: SpinImageModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [rotX, setRotX] = useState(10);
  const [rotY, setRotY] = useState(-10);
  const [velX, setVelX] = useState(0);
  const [velY, setVelY] = useState(0);
  const lastTimeRef = useRef(0);
  const inertiaIdRef = useRef<number | null>(null);
  const lastClickTimeRef = useRef(0);

  const ROT_FACTOR = 0.8; // 더욱 민감하게 증가
  const FRICTION = 0.98; // 관성을 훨씬 오래 유지
  const DOUBLE_CLICK_DELAY = 300; // 더블클릭 인식 시간(ms)

  // Reset rotation when modal opens and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      setRotX(10);
      setRotY(-10);
      setVelX(0);
      setVelY(0);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const updateTransform = (rx: number, ry: number) => {
    if (cardRef.current) {
      // 이미지만 회전하도록 img 태그를 찾아서 transform 적용
      const img = cardRef.current.querySelector('img');
      if (img) {
        (img as HTMLElement).style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    }
  };

  const stopInertia = () => {
    if (inertiaIdRef.current !== null) {
      cancelAnimationFrame(inertiaIdRef.current);
      inertiaIdRef.current = null;
    }
  };

  const resetToInitialPosition = () => {
    stopInertia();
    setVelX(0);
    setVelY(0);

    const startRotX = rotX;
    const startRotY = rotY;
    const targetRotX = 10;
    const targetRotY = -10;
    const duration = 500; // 0.5초 동안 애니메이션
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic 이징 함수
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentRotX = startRotX + (targetRotX - startRotX) * easeProgress;
      const currentRotY = startRotY + (targetRotY - startRotY) * easeProgress;

      setRotX(currentRotX);
      setRotY(currentRotY);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const startInertia = () => {
    stopInertia();

    let currentVelX = velX;
    let currentVelY = velY;
    let currentRotX = rotX;
    let currentRotY = rotY;

    const frame = () => {
      currentVelX *= FRICTION;
      currentVelY *= FRICTION;

      if (Math.abs(currentVelX) < 0.001 && Math.abs(currentVelY) < 0.001) {
        stopInertia();
        return;
      }

      const dt = 16;
      currentRotY += currentVelX * dt * ROT_FACTOR;
      currentRotX -= currentVelY * dt * ROT_FACTOR;
      // rotateX 제한 제거 - 무한 회전 가능

      setRotX(currentRotX);
      setRotY(currentRotY);
      setVelX(currentVelX);
      setVelY(currentVelY);

      inertiaIdRef.current = requestAnimationFrame(frame);
    };

    inertiaIdRef.current = requestAnimationFrame(frame);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    // 더블클릭 감지
    if (timeSinceLastClick < DOUBLE_CLICK_DELAY) {
      resetToInitialPosition();
      lastClickTimeRef.current = 0; // 리셋
      return;
    }

    lastClickTimeRef.current = now;
    setIsPointerDown(true);
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
    stopInertia();
    setLastX(e.clientX);
    setLastY(e.clientY);
    lastTimeRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown) return;

    const now = performance.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dt = Math.max(now - lastTimeRef.current, 1); // 최소값 1로 설정하여 0 방지

    // 즉시 회전 적용 - rotateX도 무제한으로 회전
    setRotY(ry => ry + dx * ROT_FACTOR);
    setRotX(rx => rx - dy * ROT_FACTOR);

    // 속도 계산 - 더 큰 배수 적용
    setVelX((dx / dt) * 2);
    setVelY((dy / dt) * 2);

    setLastX(e.clientX);
    setLastY(e.clientY);
    lastTimeRef.current = now;
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }
    startInertia();
  };

  useEffect(() => {
    updateTransform(rotX, rotY);
  }, [rotX, rotY]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopInertia();
    };
  }, []);

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Full screen backdrop */}
      <div
        className="fixed inset-0 bg-black/90 transition-opacity"
        style={{ zIndex: 99999 }}
        onClick={onClose}
      />

      {/* 3D Spin Container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-6"
        style={{ zIndex: 100000 }}
      >
        <div
          className="w-full max-w-md relative"
          style={{
            perspective: "1200px",
            touchAction: "none"
          }}
        >
          {/* Close button - 카드 우측 상단에 배치 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-black hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>

          <div
            ref={cardRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onPointerLeave={(e) => {
              if (isPointerDown) handlePointerEnd(e);
            }}
            className={`relative w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl ${
              isPointerDown ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              transition: "box-shadow 0.2s ease",
              boxShadow: isPointerDown
                ? "0 18px 26px rgba(0, 0, 0, 0.25)"
                : "0 26px 40px rgba(0, 0, 0, 0.18)"
            }}
          >
            <img
              src={imageUrl}
              alt={imageName}
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
              style={{
                transformStyle: "preserve-3d"
              }}
            />
          </div>
        </div>
      </div>

      {/* Instruction text */}
      <div
        className="fixed bottom-12 left-0 right-0 flex justify-center"
        style={{ zIndex: 100001 }}
      >
        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
          <p className="text-white text-sm">드래그해서 이미지를 회전시켜보세요</p>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
