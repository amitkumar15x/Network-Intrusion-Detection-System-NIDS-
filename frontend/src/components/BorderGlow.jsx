import React, { useRef, useEffect } from 'react';
import './BorderGlow.css';

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 50,
  glowColor = '139, 92, 246', // RGB values
  backgroundColor = '#111827',
  borderRadius = 16,
  glowRadius = 120,
  glowIntensity = 0.8
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      if (!canvas || !ctx) return;
      const { width, height } = container.getBoundingClientRect();
      
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Render outer neon glow trail
      if (mouseX !== -9999 && mouseY !== -9999) {
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, glowRadius
        );
        gradient.addColorStop(0, `rgba(${glowColor}, ${glowIntensity})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        
        // Define path matching border radius
        ctx.beginPath();
        ctx.roundRect(1, 1, width - 2, height - 2, borderRadius);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [glowColor, glowRadius, glowIntensity, borderRadius]);

  return (
    <div 
      ref={containerRef} 
      className={`border-glow-wrapper ${className}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <canvas ref={canvasRef} className="border-glow-canvas" />
      <div 
        className="border-glow-content"
        style={{ 
          backgroundColor, 
          borderRadius: `${borderRadius - 1}px` 
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;