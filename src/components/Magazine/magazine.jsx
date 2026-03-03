import React, { useState, useRef, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import pdf1 from "/Magazines/Edition_1.pdf";
import pdf2 from "/Magazines/Edition_2.pdf";
import pdf3 from "/Magazines/AIC_Edition3.pdf";
import { Document, Page, pdfjs } from "react-pdf";
import "./magazine.css";
import backBut from '../../assets/backBut.webp';
import Cursor from "../Cursor/cursor";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function BackButton(props) {
  useEffect(() => {
    if (props.top) {
      document.getElementById('backButtonWrap').style.top = props.top;
    }
    if (props.left) {
      document.getElementById('backButtonWrap').style.left = props.left;
    }
    if (props.filter) {
      document.getElementById('backButtonWrap').style.filter = props.filter;
    }
    if (props.color) {
      document.getElementById('backtxt').style.color = props.color;
    }
    if (!props.textDisplay) {
      document.getElementById('backtxt').style.display = 'none';
    }
    if (props.data) {
      document.getElementById('backtxt').innerText = props.data;
    }
  }, []);

  return (
    <div onClick={() => window.location.href = '/'} id='backButtonWrap' className='backButtonWrap'>
      <img src={backBut} alt="" srcSet="" />
      <h5 id='backtxt'>Back</h5>
    </div>
  );
}

const Pages = React.forwardRef((props, ref) => (
  <div className="demoPage" ref={ref}>
    {/*eslint-disable-next-line react/prop-types*/}
    {props.children}
  </div>
));

Pages.displayName = "Pages";

const MOBILE_BREAKPOINT = 768;
const MIN_SCALE = 1;
const MAX_SCALE = 2;
const SCALE_STEP = 0.25;

function Flipbook() {
  const [numPages, setNumPages] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pdf, setPdf] = useState(pdf3);
  const [scale, setScale] = useState(MIN_SCALE);
  const [isLoading, setIsLoading] = useState(true);

  const book = useRef();
  const containerRef = useRef();
  const baseWidth = useRef(0);
  const baseHeight = useRef(0);

  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;

    let width = isMobileView
      ? Math.min(containerWidth * 0.9, 400)
      : Math.min(containerWidth * 0.4, 600);
    let height = width * 1.4;

    if (height > containerHeight * 0.8) {
      height = containerHeight * 0.8;
      width = height / 1.4;
    }

    return { width, height };
  }, []);

  const updateDimensions = useCallback(() => {
    const newDimensions = calculateDimensions();
    if (!newDimensions) return;

    baseWidth.current = newDimensions.width;
    baseHeight.current = newDimensions.height;
    setDimensions({
      width: newDimensions.width * scale,
      height: newDimensions.height * scale
    });
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
  }, [calculateDimensions, scale]);

  useEffect(() => {
    updateDimensions();
    const debouncedResize = debounce(updateDimensions, 100);
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [updateDimensions]);

  useEffect(() => {
    setScale(MIN_SCALE);
    setPageNumber(1);
    setIsLoading(true);
    if (book.current) {
      book.current.pageFlip().flip(0);
    }
  }, [pdf]);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    if (book.current && pageNumber > 1) {
      book.current.pageFlip().flipPrev();
      setPageNumber(prev => Math.max(1, prev - (isMobile ? 1 : 2)));
    }
  }, [pageNumber, isMobile]);

  const goToNextPage = useCallback(() => {
    if (book.current && pageNumber < numPages) {
      book.current.pageFlip().flipNext();
      setPageNumber(prev => Math.min(numPages, prev + (isMobile ? 1 : 2)));
    }
  }, [pageNumber, numPages, isMobile]);

  const onFlip = useCallback((e) => {
    setPageNumber(e.data + 1);
  }, []);

  const handleButtonClick1 = useCallback(() => {
    setPdf(pdf1);
  }, []);

  const handleButtonClick2 = useCallback(() => {
    setPdf(pdf2);
  }, []);

  const handleButtonClick3 = useCallback(() => {
    setPdf(pdf3);
  }, []);

  const handleZoomIn = useCallback(() => {
    if (scale < MAX_SCALE) {
      setScale(prev => Math.min(prev + SCALE_STEP, MAX_SCALE));
    }
  }, [scale]);

  const handleZoomOut = useCallback(() => {
    if (scale > MIN_SCALE) {
      setScale(prev => Math.max(prev - SCALE_STEP, MIN_SCALE));
    }
  }, [scale]);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <>
      <Cursor />
      <BackButton data='Visit Main Site' top="10px" textDisplay={true} filter='invert(1)' />
      <div className="magazine-wrapper">
        <div className="nav-bar">
          <div className="previousButton">
            <button onClick={goToPrevPage} disabled={pageNumber <= 1} type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.99996 17C8.99996 17 4.00001 13.3176 4 12C3.99999 10.6824 9 7 9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="middleButton">
            <span>{pageNumber}</span>
            <div className="middleSymbol">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                <path d="M21 4C11.0535 4 12.9465 20 3 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>{numPages}</span>
          </div>
          <div className="nextButton">
            <button onClick={goToNextPage} disabled={pageNumber >= numPages} type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mag-container" ref={containerRef}>
          {dimensions.width > 0 && (
            <div
              className={`magazine-scaler ${isLoading ? 'loading' : ''}`}
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            >
              <HTMLFlipBook
                ref={book}
                width={baseWidth.current}
                height={baseHeight.current}
                size="stretch"
                minWidth={baseWidth.current}
                maxWidth={baseWidth.current}
                minHeight={baseHeight.current}
                maxHeight={baseHeight.current}
                showCover={true}
                onFlip={onFlip}
                className="magazine"
                flippingTime={1000}
                usePortrait={isMobile}
                startPage={0}
                drawShadow={true}
                maxShadowOpacity={0.5}
                showPageCorners={true}
                disableFlipByClick={false}
                mobileScrollSupport={true}
              >
                {[...Array(numPages).keys()].map((n) => (
                  <Pages key={n} number={`${n + 1}`}>
                    <Document
                      file={pdf}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={<div className="loading">Loading page...</div>}
                      error={<div className="error">Error loading PDF!</div>}
                    >
                      <Page
                        pageNumber={n + 1}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        width={baseWidth.current}
                        height={baseHeight.current}
                        className="pdf-page"
                        loading={<div className="loading">Loading page...</div>}
                      />
                    </Document>
                  </Pages>
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </div>

        <div className="bottom-bar">
          <div className="dropdown">
            <button className="dropbtn" type="button">Change Edition</button>
            <div className="dropdown-content">
              <button className="edition" onClick={handleButtonClick1} type="button">Edition 1</button>
              <button className="edition" onClick={handleButtonClick2} type="button">Edition 2</button>
              <button className="edition" onClick={handleButtonClick3} type="button">Edition 3</button>
            </div>
          </div>
          <div className="zoom-controls">
            <button
              type="button"
              className={`control-btn ${scale >= MAX_SCALE ? 'disabled' : ''}`}
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              aria-label="Zoom in"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7.5 11L14.5 11M11 7.5V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className={`control-btn ${scale <= MIN_SCALE ? 'disabled' : ''}`}
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
              aria-label="Zoom out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7.5 11H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Flipbook;
