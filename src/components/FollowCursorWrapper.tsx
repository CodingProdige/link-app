import React, { useEffect, useState, useRef, cloneElement, ReactElement } from 'react';

interface FollowCursorWrapperProps {
  children: ReactElement | ReactElement[];
}

const FollowCursorWrapper: React.FC<FollowCursorWrapperProps> = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const childrenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const calculate3DRotation = (image: HTMLDivElement | null) => {
    if (!image) return { rotateX: 0, rotateY: 0 };
    const rect = image.getBoundingClientRect();
    const imageCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const deltaX = position.x - imageCenter.x;
    const deltaY = position.y - imageCenter.y;

    // Limit the tilt angle to a maximum of 15 degrees in each direction
    const rotateX = Math.max(-15, Math.min(15, (deltaY / rect.height) * 30));
    const rotateY = Math.max(-15, Math.min(15, -(deltaX / rect.width) * 30));

    return { rotateX, rotateY };
  };

  useEffect(() => {
    const updateStyles = () => {
      childrenRefs.current.forEach((image) => {
        if (image) {
          const { rotateX, rotateY } = calculate3DRotation(image);
          image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
      });
      requestRef.current = requestAnimationFrame(updateStyles);
    };

    requestRef.current = requestAnimationFrame(updateStyles);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [position]);

  const childArray = React.Children.toArray(children);

  return (
    <>
      {childArray.map((child, index) => {
        const ref = (el: HTMLDivElement | null) => {
          childrenRefs.current[index] = el;
        };

        return cloneElement(child as React.ReactElement, { ref });
      })}
    </>
  );
};

export default FollowCursorWrapper;
