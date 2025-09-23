//import react hooks
import { useEffect, useRef, useState, useCallback } from "react";

//Initalize function props for images
type Props = { images: string[] };


/**
 * CenterSnapCarousel
 * - Horizontally scrollable, center-snap image carousel with drag-to-scroll
 * - Throttles scroll handling via requestAnimationFrame
 * - Uses pointer capture so dragging continues outside the scroller bounds
 */
export default function CenterSnapCarousel({ images }: Props) {
  //initalizing references and states
  const scrollerRef = useRef<HTMLDivElement | null>(null);//Dom node for entire scrollbar reference

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);//For each image
  
  const [active, setActive] = useState(0);//Index for most centered image

  const isDownRef = useRef(false);//Check if pressed on

  const startXRef = useRef(0);//Track where mouse x coordinate is on the scrollbar

  const startScrollLeftRef = useRef(0);//Track how far the scrollbar is already scrolled

  const [isDragging, setIsDragging] = useState(false);//Check for dragging from user mouse
  
  //Function to initalize reference that keeps track of each images div container in a useCallback function so function does not have
  //to create a new function object every render
  const setItemRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null): void => {
      itemRefs.current[idx] = el;
    },
    []
  );

  //components effect once every mount
  useEffect(() => {

    //Check if scrollbar DOM nod exists
    const scroller = scrollerRef.current;
    if (!scroller) return;

    //Check most centered image and set index to active state
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

    //remove unnecessary call backs to updateActive piling up from scroll events and only call latest updateActive to animation frame
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    };

    // Disable mouse wheel scrolling (keep touch scrolling)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    //Add event listeners and connect them to onScroll() and onWheel()
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });

    //Initalize first centered image when scrollbar first mounted
    updateActive();

    //Update centered image is any screen resizing occurs
    const ro = new ResizeObserver(updateActive);
    ro.observe(scroller);

    //Remove Eventlisteners and ResizeObserver when scrollbar gets unmounted
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  
  // Pointer mouse positioning variables every time mouse is clicked on scrollbar
  const onPointerDown= (e: React.PointerEvent<HTMLDivElement>)=> {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    isDownRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = scroller.scrollLeft;
    setIsDragging(true);
    scroller.setPointerCapture?.(e.pointerId);//To continue updating variables after mouse leaves scrollbar but is still holding drag
                                             
  };

  //update variables when mouse pointer is dragging while clicked
  const onPointerMove= (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDownRef.current || !scrollerRef.current) return;
    e.preventDefault(); // prevent text/image selection while dragging
    const dx = e.clientX - startXRef.current; 
    scrollerRef.current.scrollLeft = startScrollLeftRef.current - dx;
  };


  //update variables when drag ends
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    setIsDragging(false);
    scrollerRef.current?.releasePointerCapture?.(e.pointerId);
  };

  return (
    
    <div className="relative">
      {/* Styling scrollbar and connecting functions to different mouse events*/}
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

        style={{ scrollbarWidth: "none" }} 
      >
        {/* Displaying each image from images array and set each image div container to itemRefs through setItemRef()*/}
        {images.map((src, i) => (
          <div
            key={i}
            ref={setItemRef(i)}
            role="listitem"
            //style and check if image is at the center, if center than make image pop out of scrollbar effect
            className={`flex-none snap-center transform-gpu transition-transform duration-300 ${
              active === i ? "scale-105 opacity-100" : "scale-90 opacity-60"}`}
          >
             {/* styling image*/}
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
