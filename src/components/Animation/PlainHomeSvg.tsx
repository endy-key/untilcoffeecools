const HOME_PATH = 'M66 10.0224C64.6667 6.18909 59.8 -0.577579 51 3.02242C40 7.52242 23.5 16.0224 2 77.0224C27.5 34.5 34.8333 44.1891 31 53.0224C26.8333 59.6891 18.9 73.8224 20.5 77.0224C22.1 80.2224 28 79.5224 32 75.0224C35.5 71.0849 58.1 42.2224 64.5 45.0224C56 48 45.5 58.0224 42.5 65.0224C40.1 70.6224 40.5 75.3558 41 77.0224C41.7433 79.5 50.7 80.1224 57.5 72.5224C66 63.0224 74 46.5 65 45.0224C75 44.6224 65.5 63.1891 59.5 72.5224C64.5 72.6891 77.6 67.6224 90 46.0224C92 43 94.5 45 94 46.0224L78.5 79.0224C89.5 61.6891 108 39.5 109.5 47.5C109.5 49.4776 97.8333 77.3558 97 79.0224C104.667 67.5224 120.9 42.2224 126.5 47.0224C126.5 57.0224 114 69.0224 114.5 76.5224C115 84.0224 134 66.0224 138 63.0224C139.2 62.1224 161.5 61.5 164 52.5224C164.667 47.6891 162.9 40.1224 150.5 48.5224C135 59.0224 134.5 75.0224 135.5 76.5224C136.5 78.0224 149 87.0224 169 62.0224';

// 静的HTMLでも形が残る薄い軌跡と、CSSで描画する前景線を重ねて手書き感を作ります。
export const PlainHomeSvg = () => (
    <svg
        viewBox="0 0 200 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-svg"
        aria-hidden="true"
        focusable="false"
    >
        <defs>
            <linearGradient id="hero-logo-ink" x1="16" y1="8" x2="178" y2="86" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fffaf2" />
                <stop offset="0.54" stopColor="#f8e4ca" />
                <stop offset="1" stopColor="#eabf8c" />
            </linearGradient>
        </defs>
        <path
            d={HOME_PATH}
            className="hero-svg-track"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
        />
        <path
            d={HOME_PATH}
            className="hero-svg-ink"
            pathLength="1"
            stroke="url(#hero-logo-ink)"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
        />
        <path
            d="M80 90 C106 86 134 85 165 78"
            className="hero-svg-flourish"
            pathLength="1"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
