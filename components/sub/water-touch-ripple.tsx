"use client";

import React, { useEffect, useRef } from "react";

interface RealWaterWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
  decay: number;
  wavelength: number;
  crestWidth: number;
  age: number;
  isWake?: boolean; // Wake wave created by dragging hand through water
}

export const WaterTouchRipple = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wavesRef = useRef<RealWaterWave[]>([]);
  const animFrameId = useRef<number | null>(null);
  const isRunning = useRef<boolean>(false);

  // Audio Context & Buffer for low-latency water-click sound on Android/iOS
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const fallbackAudiosRef = useRef<HTMLAudioElement[]>([]);
  const audioPoolIndex = useRef<number>(0);
  const lastSoundTime = useRef<number>(0);

  useEffect(() => {
    // 1. Initialize Web Audio & Fallback HTML5 Audio Pool
    const soundUrl = "/skills/water-click.wav";

    try {
      fallbackAudiosRef.current = [
        new Audio(soundUrl),
        new Audio(soundUrl),
        new Audio(soundUrl),
        new Audio(soundUrl),
      ];
      fallbackAudiosRef.current.forEach((audio) => {
        audio.volume = 0.45;
        audio.preload = "auto";
      });
    } catch {
      // Audio fallback
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        fetch(soundUrl)
          .then((res) => res.arrayBuffer())
          .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
          .then((decoded) => {
            audioBufferRef.current = decoded;
          })
          .catch(() => {});
      }
    } catch {
      // Web Audio unsupported
    }

    const playWaterSound = (volumeScale = 1.0, pitchVariation = 0.12) => {
      const now = performance.now();
      // Throttle rapid sounds (minimum 80ms gap) to prevent audio clutter while dragging hand
      if (now - lastSoundTime.current < 80) return;
      lastSoundTime.current = now;

      try {
        const audioCtx = audioCtxRef.current;
        const buffer = audioBufferRef.current;

        if (audioCtx && buffer) {
          if (audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => {});
          }

          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.playbackRate.value = 0.94 + (Math.random() - 0.5) * pitchVariation;

          const gainNode = audioCtx.createGain();
          gainNode.gain.value = Math.min(0.6, 0.48 * volumeScale);

          source.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          source.start(0);
          return;
        }

        const pool = fallbackAudiosRef.current;
        if (pool && pool.length > 0) {
          const audio = pool[audioPoolIndex.current % pool.length];
          audioPoolIndex.current++;
          audio.currentTime = 0;
          audio.volume = Math.min(0.6, 0.48 * volumeScale);
          audio.play().catch(() => {});
        }
      } catch {
        // Ignored
      }
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Natural light source vector from top-left (-45deg) reflecting across water
    const LIGHT_DIR_X = -0.7071;
    const LIGHT_DIR_Y = -0.7071;

    // Physical water rendering loop
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const waves = wavesRef.current;

      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.age += 1;

        // Wave dispersion: decelerates as it expands outward across the surface
        const progress = wave.radius / wave.maxRadius;
        wave.speed = Math.max(0.9, (1 - progress * 0.55) * (wave.isWake ? 2.4 : 3.2));
        wave.radius += wave.speed;
        wave.alpha -= wave.decay * (1 + progress * 0.7);

        if (wave.alpha <= 0.005 || wave.radius >= wave.maxRadius) {
          waves.splice(i, 1);
          continue;
        }

        const currentAlpha = Math.max(0, wave.alpha);

        // Fluid wave harmonics: Main crest, secondary follow, tertiary trailing wake
        const waveOffsets = wave.isWake
          ? [0, -wave.wavelength * 0.8]
          : [0, -wave.wavelength, -wave.wavelength * 1.8];

        waveOffsets.forEach((offset, idx) => {
          const r = wave.radius + offset;
          if (r <= 2) return;

          const harmonicAlpha = currentAlpha * Math.pow(0.7, idx);
          if (harmonicAlpha <= 0.005) return;

          // Wave crest broadens naturally as water spreads (fluid mass conservation)
          const baseWidth = Math.max(2.5, (1 + progress * 0.4) * (wave.crestWidth - idx * 1.5));

          // -------------------------------------------------------------
          // LAYER 1: Deep Optical Trough (Water Depression Shadow)
          // As water rises in a crest, it pulls a trough behind it
          // -------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            wave.x - LIGHT_DIR_X * (baseWidth * 0.7),
            wave.y - LIGHT_DIR_Y * (baseWidth * 0.7),
            r,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(0, 4, 18, ${harmonicAlpha * 0.5})`;
          ctx.lineWidth = baseWidth * 1.8;
          ctx.stroke();
          ctx.restore();

          // -------------------------------------------------------------
          // LAYER 2: Transparent Liquid Refraction Body (Water Lens Sheen)
          // -------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200, 230, 255, ${harmonicAlpha * 0.3})`;
          ctx.lineWidth = baseWidth * 1.2;
          ctx.stroke();
          ctx.restore();

          // -------------------------------------------------------------
          // LAYER 3: Chromatic Dispersion (Prismatic Water Highlight)
          // Sunlight through real water splits slightly into spectral colors!
          // Inner edge: faint violet-blue / Outer edge: crisp white-cyan
          // -------------------------------------------------------------
          // Prismatic Inner Rim (Violet-Blue Refraction)
          ctx.save();
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, Math.max(1, r - baseWidth * 0.3), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(167, 139, 250, ${harmonicAlpha * 0.22})`;
          ctx.lineWidth = baseWidth * 0.5;
          ctx.stroke();
          ctx.restore();

          // -------------------------------------------------------------
          // LAYER 4: 3D Directional Specular Sunlight Glint (Top-Left)
          // The defining feature of real liquid: bright reflective crest facing light
          // -------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            wave.x + LIGHT_DIR_X * (baseWidth * 0.4),
            wave.y + LIGHT_DIR_Y * (baseWidth * 0.4),
            r,
            0,
            Math.PI * 2
          );

          const specGrad = ctx.createLinearGradient(
            wave.x - r * 0.75,
            wave.y - r * 0.75,
            wave.x + r * 0.75,
            wave.y + r * 0.75
          );
          // Top-left crest: pure brilliant liquid specular reflection
          specGrad.addColorStop(0, `rgba(255, 255, 255, ${harmonicAlpha * 0.95})`);
          specGrad.addColorStop(0.3, `rgba(230, 245, 255, ${harmonicAlpha * 0.7})`);
          // Sideways: soft water surface refraction
          specGrad.addColorStop(0.65, `rgba(147, 197, 253, ${harmonicAlpha * 0.25})`);
          // Bottom-right: subtle liquid boundary
          specGrad.addColorStop(1, `rgba(255, 255, 255, ${harmonicAlpha * 0.05})`);

          ctx.strokeStyle = specGrad;
          ctx.lineWidth = Math.max(1.2, baseWidth * 0.65);
          ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
          ctx.shadowBlur = 4;
          ctx.stroke();
          ctx.restore();
        });

        // -------------------------------------------------------------
        // 5. Central Fluid Meniscus Plop & Rebound (Impact droplet)
        // -------------------------------------------------------------
        if (!wave.isWake && wave.age < 35) {
          const reboundPhase = wave.age / 35;
          const reboundHeight = Math.sin(reboundPhase * Math.PI);
          const reboundAlpha = (1 - reboundPhase) * currentAlpha * 1.4;
          const beadRadius = Math.max(0.5, reboundHeight * 4.2);

          ctx.save();
          // Drop shadow under rising droplet
          ctx.beginPath();
          ctx.arc(wave.x + 1, wave.y + 1, beadRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 10, 30, ${reboundAlpha * 0.4})`;
          ctx.fill();

          // Droplet body with specular light point
          const beadGrad = ctx.createRadialGradient(
            wave.x - beadRadius * 0.35,
            wave.y - beadRadius * 0.35,
            0.5,
            wave.x,
            wave.y,
            beadRadius
          );
          beadGrad.addColorStop(0, `rgba(255, 255, 255, ${reboundAlpha * 0.98})`);
          beadGrad.addColorStop(0.5, `rgba(215, 240, 255, ${reboundAlpha * 0.75})`);
          beadGrad.addColorStop(0.9, `rgba(125, 185, 235, ${reboundAlpha * 0.3})`);
          beadGrad.addColorStop(1, `rgba(120, 180, 230, 0)`);

          ctx.beginPath();
          ctx.arc(wave.x, wave.y, beadRadius, 0, Math.PI * 2);
          ctx.fillStyle = beadGrad;
          ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();
        }
      }

      if (waves.length > 0) {
        animFrameId.current = requestAnimationFrame(render);
      } else {
        isRunning.current = false;
        ctx.clearRect(0, 0, w, h);
      }
    };

    const startRender = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    // Tracking last touch position to generate natural fluid wake when dragging hand through water
    let lastTouchX = -100;
    let lastTouchY = -100;
    let lastTriggerTime = 0;

    // Initial Touch / Tap Wave (Deep circular impact)
    const triggerImpactWave = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastTriggerTime < 45 && Math.hypot(x - lastTouchX, y - lastTouchY) < 15) {
        return;
      }
      lastTriggerTime = now;
      lastTouchX = x;
      lastTouchY = y;

      playWaterSound(1.0, 0.14);

      // Primary wave front
      wavesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: Math.min(window.innerWidth * 0.42, 160),
        speed: 3.2,
        alpha: 0.9,
        decay: 0.012,
        wavelength: 24,
        crestWidth: 7.5,
        age: 0,
        isWake: false,
      });

      // Secondary delayed fluid echo (Natural surface rebound oscillation)
      setTimeout(() => {
        wavesRef.current.push({
          x,
          y,
          radius: 2,
          maxRadius: Math.min(window.innerWidth * 0.32, 120),
          speed: 2.3,
          alpha: 0.58,
          decay: 0.015,
          wavelength: 20,
          crestWidth: 6.0,
          age: 0,
          isWake: false,
        });
        startRender();
      }, 85);

      startRender();
    };

    // Dragging / Gliding Hand through water (Continuous Fluid Wake)
    // "pani te hat dile jemon web hoy omon"
    const triggerHandGlideWake = (x: number, y: number) => {
      const dx = x - lastTouchX;
      const dy = y - lastTouchY;
      const dist = Math.hypot(dx, dy);

      // Only shed fluid wake after moving at least 18px
      if (dist < 18) return;

      lastTouchX = x;
      lastTouchY = y;

      // Soft water slosh sound while hand moves through water
      playWaterSound(0.65, 0.2);

      // Create flowing wake ripple spreading outward from moving finger
      wavesRef.current.push({
        x,
        y,
        radius: 6,
        maxRadius: Math.min(window.innerWidth * 0.25, 85),
        speed: 2.1,
        alpha: 0.65,
        decay: 0.02,
        wavelength: 14,
        crestWidth: 5.5,
        age: 0,
        isWake: true,
      });

      startRender();
    };

    // Mobile / Android / iPhone Touch Listeners (Passive for 120Hz smooth scrolling)
    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        triggerImpactWave(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        triggerHandGlideWake(touch.clientX, touch.clientY);
      }
    };

    // Pointer down handler: ONLY triggers for touch/pen on mobile, Android, tablets, iPhone
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        triggerImpactWave(e.clientX, e.clientY);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        triggerHandGlideWake(e.clientX, e.clientY);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99997]"
      aria-hidden="true"
    />
  );
};
