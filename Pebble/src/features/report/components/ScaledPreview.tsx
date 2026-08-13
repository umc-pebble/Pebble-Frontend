import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface ScaledPreviewProps {
  /** 안쪽 콘텐츠의 실제 너비(px). 이 너비 기준으로 레이아웃이 잡힙니다 */
  width: number;
  /** 축소 비율. 0.5 면 절반 크기로 보입니다 */
  scale: number;
  children: ReactNode;
}

/**
 * 콘텐츠를 원래 크기로 배치한 뒤 CSS transform 으로만 축소해 보여줍니다.
 *
 * R007 이 R003~R006 을 그대로 재사용하면서도 작게 보이게 하는 장치입니다.
 * 각 섹션에 "작은 버전" 스타일을 따로 만들지 않아도 되고, 디자인이 바뀌어도
 * 한 곳만 고치면 양쪽에 반영됩니다.
 *
 * transform 은 레이아웃 높이를 줄이지 않기 때문에 안쪽 높이를 측정해
 * 바깥 박스 높이를 직접 맞춰줍니다. (안 그러면 아래에 빈 공간이 남습니다)
 *
 * 주의: 이미지 저장 시 캡처 대상 ref 는 이 컴포넌트가 아니라 children 쪽
 * 래퍼에 붙이세요. transform 이 걸린 노드를 캡처하면 결과가 함께 축소됩니다.
 */
export function ScaledPreview({ width, scale, children }: ScaledPreviewProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [innerHeight, setInnerHeight] = useState(0);

  useLayoutEffect(() => {
    const element = innerRef.current;
    if (!element) return;

    const update = () => setInnerHeight(element.offsetHeight);
    update();

    // 폰트 로드나 이미지 로드로 높이가 변할 수 있어 계속 관찰합니다
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{ width: width * scale, height: innerHeight * scale }}
      className="overflow-visible"
    >
      <div
        ref={innerRef}
        style={{
          width,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
