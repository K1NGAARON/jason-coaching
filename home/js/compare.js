// EERDER/NU-VERGELIJKER
document.querySelectorAll('.compare').forEach(compare => {
    const range = compare.querySelector('.compare-range');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let intro = null;
    let touched = false;

    const setPos = p => {
        p = Math.min(100, Math.max(0, p));
        compare.style.setProperty('--p', p);
        range.value = Math.round(p);
    };

    const posFromPointer = e => {
        const rect = compare.getBoundingClientRect();
        return (e.clientX - rect.left) / rect.width * 100;
    };

    const stopIntro = () => {
        touched = true;
        if (intro) cancelAnimationFrame(intro);
        intro = null;
    };

    compare.addEventListener('pointerdown', e => {
        stopIntro();
        compare.setPointerCapture(e.pointerId);
        compare.classList.add('is-dragging');
        setPos(posFromPointer(e));
    });

    compare.addEventListener('pointermove', e => {
        if (compare.classList.contains('is-dragging')) setPos(posFromPointer(e));
    });

    ['pointerup', 'pointercancel'].forEach(type => {
        compare.addEventListener(type, () => compare.classList.remove('is-dragging'));
    });

    range.addEventListener('input', () => {
        stopIntro();
        setPos(Number(range.value));
    });

    // eenmalige hint dat je kan slepen: 50 → 25 → 75 → 50
    if (reduceMotion) return;

    const hint = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        hint.disconnect();

        const keys = [50, 25, 75, 50];
        const duration = 2200;
        const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        let start = null;

        const step = now => {
            start ??= now;
            const t = Math.min(1, (now - start) / duration) * (keys.length - 1);
            const i = Math.min(keys.length - 2, Math.floor(t));
            setPos(keys[i] + (keys[i + 1] - keys[i]) * ease(t - i));
            intro = t < keys.length - 1 ? requestAnimationFrame(step) : null;
        };

        setTimeout(() => {
            if (!touched) intro = requestAnimationFrame(step);
        }, 900);
    }, { threshold: 0.6 });

    hint.observe(compare);
});
