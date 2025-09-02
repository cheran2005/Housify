import { useEffect, useRef, useState, useCallback } from "react";

//Initalize function props to be a array of images in the side scroll bar
type Props = { images: string[] };


export default function CenterSnapCarousel({ images }: Props) {
  //initalizing all the variables used in the side scroll bar
  const scrollerRef = useRef<HTMLDivElement | null>(null);//html element reference 
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);//images reference
  const [active, setActive] = useState(0);//active is a variable, setActive is the function that helps update and trigger a re-render, 
                                          // and usestate(0) initializes active to 0

  // setting variables that track for dragging
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  
  const setItemRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null): void => {
      itemRefs.current[idx] = el;
    },
    []
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateActive = () => {
      const { left, width } = scroller.getBoundingClientRect();
      const centerX = left + width / 2;

      let bestIndex = 0;
      let bestDist = Infinity;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - centerX);
        if (d < bestDist) {
          bestDist = d;
          bestIndex = i;
        }
      });

      setActive(bestIndex);
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    };

    // Disable mouse wheel scrolling (keep touch scrolling)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });
    updateActive();

    const ro = new ResizeObserver(updateActive);
    ro.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [images.length]);

  // Pointer (mouse/touch pen) drag handlers
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    isDownRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = scroller.scrollLeft;
    setIsDragging(true);
    scroller.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isDownRef.current || !scrollerRef.current) return;
    e.preventDefault(); // prevent text/image selection while dragging
    const dx = e.clientX - startXRef.current;
    scrollerRef.current.scrollLeft = startScrollLeftRef.current - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    setIsDragging(false);
    scrollerRef.current?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        role="list"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onDragStart={(e) => e.preventDefault()}
        className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-[12vw] md:px-[18vw] 
          ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        style={{ scrollbarWidth: "none" }} // hides Firefox scrollbar
      >
        {images.map((src, i) => (
          <div
            key={i}
            ref={setItemRef(i)}
            role="listitem"
            className={`flex-none snap-center transform-gpu transition-transform duration-300 ${
              active === i ? "scale-105 opacity-100" : "scale-90 opacity-60"
            }`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              draggable={false}
              className="h-56 w-96 object-cover rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
