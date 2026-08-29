'use client';

import Image from 'next/image';
import {
    useEffect,
    useRef,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import { PlainHomeSvg } from '@/components/Animation/PlainHomeSvg';
import { siteConfig } from '@/config/site';

type DecorativeStyle = CSSProperties & Record<`--${string}`, string | number>;

interface Particle {
    left: number;
    bottom: number;
    size: number;
    duration: number;
    delay: number;
    drift: number;
    rise: number;
    opacity: number;
}

interface CoffeeBean {
    left: number;
    top: number;
    size: number;
    duration: number;
    delay: number;
    rotation: number;
}

// SSRとブラウザで同じ景色になるよう、装飾の位置と速度は固定値で管理します。
const PARTICLES: Particle[] = [
    { left: 7, bottom: 10, size: 4, duration: 10, delay: -2, drift: 14, rise: 150, opacity: 0.34 },
    { left: 14, bottom: 3, size: 7, duration: 13, delay: -8, drift: -18, rise: 205, opacity: 0.24 },
    { left: 22, bottom: 18, size: 3, duration: 9, delay: -4, drift: 10, rise: 135, opacity: 0.42 },
    { left: 31, bottom: 6, size: 5, duration: 12, delay: -10, drift: -12, rise: 185, opacity: 0.3 },
    { left: 39, bottom: 14, size: 3, duration: 11, delay: -6, drift: 20, rise: 165, opacity: 0.32 },
    { left: 48, bottom: 2, size: 6, duration: 14, delay: -1, drift: -8, rise: 220, opacity: 0.22 },
    { left: 57, bottom: 17, size: 4, duration: 10, delay: -7, drift: 15, rise: 145, opacity: 0.34 },
    { left: 65, bottom: 7, size: 3, duration: 12, delay: -3, drift: -16, rise: 190, opacity: 0.4 },
    { left: 73, bottom: 13, size: 6, duration: 15, delay: -11, drift: 11, rise: 230, opacity: 0.2 },
    { left: 81, bottom: 4, size: 4, duration: 11, delay: -5, drift: -13, rise: 165, opacity: 0.31 },
    { left: 89, bottom: 16, size: 3, duration: 9, delay: -8, drift: 9, rise: 140, opacity: 0.38 },
    { left: 95, bottom: 8, size: 5, duration: 13, delay: -2, drift: -17, rise: 195, opacity: 0.24 },
];

// コーヒー豆は主役のロゴを邪魔しないよう、画面の外周にだけ配置します。
const COFFEE_BEANS: CoffeeBean[] = [
    { left: 5, top: 23, size: 14, duration: 16, delay: -4, rotation: -28 },
    { left: 19, top: 76, size: 10, duration: 19, delay: -13, rotation: 34 },
    { left: 78, top: 18, size: 12, duration: 18, delay: -9, rotation: 18 },
    { left: 92, top: 67, size: 15, duration: 21, delay: -2, rotation: -42 },
];

export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const pointerFrameRef = useRef<number | null>(null);

    useEffect(() => {
        // コンポーネント破棄時に予約済みの描画更新を残さないようにします。
        return () => {
            if (pointerFrameRef.current !== null) {
                cancelAnimationFrame(pointerFrameRef.current);
            }
        };
    }, []);

    // Reactの再レンダーを発生させず、CSS変数だけで光と背景の視差を更新します。
    function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
        if (event.pointerType === 'touch') return;

        const target = event.currentTarget;
        const bounds = target.getBoundingClientRect();
        const x = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
        const y = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1);

        if (pointerFrameRef.current !== null) {
            cancelAnimationFrame(pointerFrameRef.current);
        }

        pointerFrameRef.current = requestAnimationFrame(() => {
            target.style.setProperty('--pointer-x', `${x * 100}%`);
            target.style.setProperty('--pointer-y', `${y * 100}%`);
            target.style.setProperty('--media-x', `${(0.5 - x) * 12}px`);
            target.style.setProperty('--media-y', `${(0.5 - y) * 8}px`);
            pointerFrameRef.current = null;
        });
    }

    // ポインターが離れたら、背景を穏やかに中央位置へ戻します。
    function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
        const target = event.currentTarget;

        if (pointerFrameRef.current !== null) {
            cancelAnimationFrame(pointerFrameRef.current);
            pointerFrameRef.current = null;
        }

        target.style.setProperty('--pointer-x', '50%');
        target.style.setProperty('--pointer-y', '45%');
        target.style.setProperty('--media-x', '0px');
        target.style.setProperty('--media-y', '0px');
    }

    return (
        <section
            ref={heroRef}
            className="hero-section"
            aria-labelledby="home-hero-title"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <div className="hero-media" aria-hidden="true">
                <div className="hero-media-drift">
                    <Image
                        src={siteConfig.heroImage}
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="hero-media-image"
                        draggable={false}
                    />
                </div>
            </div>

            <div className="hero-color-wash" aria-hidden="true" />
            <div className="hero-aurora hero-aurora-left" aria-hidden="true" />
            <div className="hero-aurora hero-aurora-right" aria-hidden="true" />
            <div className="hero-spotlight" aria-hidden="true" />
            <div className="hero-grain" aria-hidden="true" />

            <div className="hero-particles" aria-hidden="true">
                {PARTICLES.map((particle, index) => (
                    <span
                        key={`${particle.left}-${particle.bottom}`}
                        className="hero-particle"
                        style={{
                            left: `${particle.left}%`,
                            bottom: `${particle.bottom}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            '--particle-duration': `${particle.duration}s`,
                            '--particle-delay': `${particle.delay}s`,
                            '--particle-drift': `${particle.drift}px`,
                            '--particle-rise': `-${particle.rise}px`,
                            '--particle-opacity': particle.opacity,
                            '--particle-index': index,
                        } as DecorativeStyle}
                    />
                ))}
            </div>

            <div className="hero-beans" aria-hidden="true">
                {COFFEE_BEANS.map((bean) => (
                    <span
                        key={`${bean.left}-${bean.top}`}
                        className="hero-bean"
                        style={{
                            left: `${bean.left}%`,
                            top: `${bean.top}%`,
                            width: `${bean.size}px`,
                            '--bean-duration': `${bean.duration}s`,
                            '--bean-delay': `${bean.delay}s`,
                            '--bean-rotation': `${bean.rotation}deg`,
                        } as DecorativeStyle}
                    />
                ))}
            </div>

            <div className="hero-content">
                <h1 id="home-hero-title" className="sr-only">
                    {siteConfig.name}
                </h1>
                <div className="hero-logo-stage">
                    <span className="hero-logo-aura" aria-hidden="true" />
                    <div className="hero-logo">
                        <PlainHomeSvg />
                    </div>
                </div>
                <p className="hero-tagline">
                    <span aria-hidden="true" />
                    {siteConfig.tagline}
                    <span aria-hidden="true" />
                </p>
            </div>

            <a className="hero-scroll" href="#latest-posts" aria-label="最新の記事へ移動">
                <span className="hero-scroll-label" aria-hidden="true">Scroll</span>
                <span className="hero-scroll-track" aria-hidden="true" />
            </a>

            <div className="hero-fade" aria-hidden="true" />
        </section>
    );
}
