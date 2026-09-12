'use client';

import { useEffect, useRef, useState, type PointerEvent, type CSSProperties } from 'react';
import Link from 'next/link';
import styles from './hero.module.css';

// ポインターの位置はCSS変数へ渡し、記事を読む操作を妨げない範囲で奥行きをつけます。
export function HeroSection() {
    const [brewing, setBrewing] = useState(false);
    const [burstId, setBurstId] = useState(0);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    // 動きを減らす設定とタッチ操作では視差を無効にして、静かな表示を維持します。
    function moveLight(event: PointerEvent<HTMLElement>) {
        if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        event.currentTarget.style.setProperty('--light-x', `${x * 100}%`);
        event.currentTarget.style.setProperty('--light-y', `${y * 100}%`);
        event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`);
        event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 9}deg`);
    }

    // 領域を離れたら光とカップを元の位置へ戻します。
    function resetLight(event: PointerEvent<HTMLElement>) {
        for (const property of ['--light-x', '--light-y', '--tilt-x', '--tilt-y']) {
            event.currentTarget.style.removeProperty(property);
        }
    }

    // カップに触れたときだけ湯気と波紋を強め、数秒後に落ち着いた状態へ戻します。
    function brew() {
        // 波紋だけを再生成し、連続で押した場合もボタンのフォーカスを失わず反応させます。
        setBurstId((id) => id + 1);
        setBrewing(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setBrewing(false), 4200);
    }

    return (
        <section className={styles.hero} aria-label="ブログの紹介" onPointerMove={moveLight} onPointerLeave={resetLight}>
            <div className={styles.spotlight} aria-hidden="true" />
            <div className={styles.watermark} aria-hidden="true">Coffee.</div>
            <div className={styles.inner}>
                <div className={styles.copy}>
                    <p className={styles.description}>
                        日々の気づきを、気ままに。
                    </p>
                    <div className={styles.actions}>
                        <a className={styles.readLink} href="#latest-posts">記事を読む<span aria-hidden="true">↗</span></a>
                        <Link className={styles.mapLink} href="/coffee-map">Coffee Map <span aria-hidden="true">→</span></Link>
                    </div>
                </div>
                <div className={`${styles.scene} ${brewing ? styles.brewing : ''}`}>
                    <div className={styles.orbit} aria-hidden="true" />
                    <div className={styles.orbitInner} aria-hidden="true" />
                    {brewing && (
                        <div key={burstId} className={styles.burst} aria-hidden="true">
                            <span className={styles.halo} />
                            <span className={styles.shockwave} />
                            <span className={styles.shockwave} />
                            {Array.from({ length: 12 }, (_, index) => (
                                <i key={index} className={styles.spark} style={{ '--angle': `${index * 30}deg`, '--delay': `${index % 3 * 90}ms` } as CSSProperties} />
                            ))}
                        </div>
                    )}
                    <div className={styles.cupStage}>
                        <button className={styles.cup} onClick={brew} aria-label="コーヒーをひと息楽しむ">
                            <span className={styles.saucer} aria-hidden="true" />
                            <span className={styles.handle} aria-hidden="true" />
                            <span className={styles.ceramic} aria-hidden="true">
                                <span className={styles.coffee}>
                                    <span className={styles.reflection} />
                                    {brewing && <span key={burstId} className={styles.ripples}><i /><i /><i /></span>}
                                </span>
                            </span>
                            <span className={styles.steam} aria-hidden="true"><i /><i /><i /></span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
