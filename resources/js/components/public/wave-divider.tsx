interface WaveDividerProps {
    flip?: boolean;
    className?: string;
    fillColor?: string;
}

export default function WaveDivider({
    flip = false,
    className = '',
    fillColor = 'fill-brand-900',
}: WaveDividerProps) {
    return (
        <div
            className={`w-full overflow-hidden leading-none pointer-events-none select-none ${
                flip ? 'rotate-180' : ''
            } ${className}`}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1440 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className={`w-full h-8 sm:h-12 md:h-16 ${fillColor}`}
            >
                <path d="M0,32 C320,80 420,0 720,40 C1020,80 1120,8 1440,32 L1440,80 L0,80 Z" />
            </svg>
        </div>
    );
}
