"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";

interface Point {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

const CanvasCursor = () => {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith("/blogs/") && pathname !== "/blogs";
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const mousePos = useRef<Point>({ x: 0, y: 0 });
  const cursorPos = useRef<Point>({ x: 0, y: 0 });
  const velocity = useRef<Velocity>({ x: 0, y: 0 });
  const lastPos = useRef<Point>({ x: 0, y: 0 });

  // Paramètres ajustables
  const SMOOTHING = 0.15;        // Lissage du mouvement (0.1-0.3)
  const TAIL_LENGTH_MULTIPLIER = 8; // Longueur de la queue
  const MIN_RADIUS = 15;         // Taille au repos
  const VELOCITY_THRESHOLD = 0.5; // Seuil pour détecter le mouvement

  // Dessiner la goutte
  const drawDroplet = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    velX: number,
    velY: number
  ) => {
    const speed = Math.sqrt(velX * velX + velY * velY);
    const angle = Math.atan2(velY, velX);
    
    // Calculer les dimensions
    const tailLength = Math.min(speed * TAIL_LENGTH_MULTIPLIER, 100);
    const radius = MIN_RADIUS;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Forme de goutte avec courbe de Bézier
    ctx.beginPath();
    
    if (speed > VELOCITY_THRESHOLD) {
      // En mouvement : forme de goutte
      ctx.moveTo(-radius, 0);
      
      // Côté supérieur
      ctx.bezierCurveTo(
        -radius, -radius * 0.8,
        -tailLength * 0.3, -radius * 0.5,
        -tailLength, 0
      );
      
      // Pointe
      ctx.lineTo(-tailLength - 5, 0);
      
      // Côté inférieur
      ctx.bezierCurveTo(
        -tailLength * 0.3, radius * 0.5,
        -radius, radius * 0.8,
        -radius, 0
      );
      
      // Tête ronde
      ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2, false);
      
    } else {
      // Au repos : cercle
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
    }
    
    ctx.closePath();
    
    // Style
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
    
    // Bordure
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  }, []);

  // Boucle d'animation
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Interpolation lisse de la position
    cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * SMOOTHING;
    cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * SMOOTHING;
    
    // Calculer la vélocité
    velocity.current.x = cursorPos.current.x - lastPos.current.x;
    velocity.current.y = cursorPos.current.y - lastPos.current.y;
    
    lastPos.current.x = cursorPos.current.x;
    lastPos.current.y = cursorPos.current.y;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner la goutte
    drawDroplet(
      ctx,
      cursorPos.current.x,
      cursorPos.current.y,
      velocity.current.x,
      velocity.current.y
    );
    
    animationRef.current = requestAnimationFrame(animate);
  }, [drawDroplet]);

  // Gestion du mouvement de la souris
  useEffect(() => {
    if (isMobile || isBlogPost) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isBlogPost]);

  // Setup canvas
  useEffect(() => {
    if (isMobile || isBlogPost) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Démarrer l'animation
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile, isBlogPost, animate]);

  if (isMobile || isBlogPost) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999]"
      style={{
        mixBlendMode: 'difference',
        cursor: 'none'
      }}
    />
  );
};

export default CanvasCursor;