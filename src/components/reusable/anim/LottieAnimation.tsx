import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

interface LottieAnimationProps {
  animationData: object;
  width?: string;
  height?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, width = "150px", height = "150px" }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    }
  }, [animationData]);

  return <div ref={container} style={{ width, height }} />;
};

export default LottieAnimation;
