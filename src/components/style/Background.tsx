import { useEffect, useRef } from 'react';

export default function CanvasEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement; // 👈 Pega o tamanho do Banner
    if (!parent) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    const color = '#EAB308'; 

    class Particle {
      x: number; y: number; size: number;
      speedX: number; speedY: number; alpha: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5; // Um pouco maior para visibilidade
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.alpha = Math.random() * 0.8 + 0.2;
      }

      update(w: number, h: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > w) this.x = 0; else if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0; else if (this.y < 0) this.y = h;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const resize = () => {
      // 👈 Ajusta o canvas ao tamanho exato do Banner, não da janela
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    // Observer para redimensionamento do elemento (mais robusto que window resize)
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(parent);

    resize();
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // 👈 Aumentei o z-index para garantir que fique sobre o background
      className="absolute inset-0 z-[25] pointer-events-none opacity-80"
    />
  );
}