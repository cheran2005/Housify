import { useEffect, useRef, useState, useCallback } from "react";

//Initalize function props to be a array of images in the side scroll bar
type Props = { images: string[] };


export default function CenterSnapCarousel({ images }: Props) {
  //initalizing reference and state variables
  const scrollerRef = useRef<HTMLDivElement | null>(null);//to reference the DOM node the entire scroll bar is inside of
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);//Array for the images that are in the carousel, each referencing to a DOM node 
  const [active, setActive] = useState(0);//state to check which image is closest to the center of the scroll bar

  // setting variables that track for dragging
  const isDownRef = useRef(false);//check for if the scrollbar is clicked by the pointer
  const startXRef = useRef(0);//where the mouse pointer is located when you first click on the scrollbar 
  const startScrollLeftRef = useRef(0);//the very left of the scrollbar x coordinate
  const [isDragging, setIsDragging] = useState(false);//state to check if the mouse is currently dragging or not

  //On every render react creates a brand new function object, useCallback stops that by making the function object once
  //and calling being able to reuse the same function object.
  
  const setItemRef = useCallback(//in this function we are setting each itemRefs array item to a DOM node.
    (idx: number) => (el: HTMLDivElement | null): void => {//React will only call a DOM node reference callback if it is a single argument, cannot have multiple reference call backs

      itemRefs.current[idx] = el;//.current so we can access the actual array items and for a specific index, put a specific DOM node where the image will be stored
    },
    []//The usecallback funciton object gets created only when the div container it is inisde mounts
  );

  useEffect(() => {//the effect of getting the most center image from the scroll bar
    const scroller = scrollerRef.current;//get the DOM node of where the side scroll bar is

    if (!scroller) return;//If no reference to the side scroll bar DOM node, cancel effect

    const updateActive = () => {//function to update what image is in the center
      const { left, width } = scroller.getBoundingClientRect();//getBoundingClientRect has a left and width object for whatever div container we are dealing with, 
                                                              // so getting the point on the most left and how wide the container is.


      const centerX = left + width / 2;//Get the center with the two values we got eariler

      let bestIndex = 0;//index variable to track which index in items ref is at the center
      let bestDist = Infinity;//Best distance from center to choose the image closest to the center, initalized with infinity so that the variable can be compared with any real numbers initially

      itemRefs.current.forEach((el, i) => {//For each item in the itemsref array of DOM nodes
        if (!el) return;//First check if that DOM node is null or not before moving further for each of the DOM nodes in the array
        const r = el.getBoundingClientRect();//set r as the variable that has all the measrument objects related to node el
        const d = Math.abs(r.left + r.width / 2 - centerX);//find the distance from the center by comparing how far the center of the DOM node element is from the center of the scroll bar
        if (d < bestDist) {//keep replacing bestDist value with the closest value
          //tracking the DOM container closest to the center and the index of that DOM container
          bestDist = d;
          bestIndex = i;
        }
      });

      setActive(bestIndex);//set the active state to the bestIndex number value
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
