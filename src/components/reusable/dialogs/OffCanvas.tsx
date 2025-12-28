import React, { useEffect, useState } from "react";
import { Offcanvas, Row } from "react-bootstrap";
import { OffcanvasPlacement } from "react-bootstrap/esm/Offcanvas";

interface MyOffCanvasProps {
    children: React.ReactNode;
    isShow: boolean;
    onHide: () => void;
    placement: OffcanvasPlacement;
    width?: number;
    height?: number;
}

const Header = ({ children }: { children: React.ReactNode }) => (
    <Offcanvas.Header closeButton>
        <Offcanvas.Title>{children}</Offcanvas.Title>
    </Offcanvas.Header>
);

const Body = ({ children }: { children: React.ReactNode }) => (
    <Offcanvas.Body>{children}</Offcanvas.Body>
);

const Footer = ({ children }: { children: React.ReactNode }) => (
    <Row
        className="m-0 px-3 py-3 bg-white"
        style={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "1px solid #ddd",
            backgroundColor: "white",
            zIndex: 10,
        }}
    >
        {children}
    </Row>
  );

  const MyOffCanvas = ({ 
    children, 
    isShow, 
    onHide, 
    placement,
    width = 100,
    height = 100
}: MyOffCanvasProps) => {

    const [isOpen, setIsOpen] = useState(isShow);
    const [animClass, setAnimClass] = useState("");
    const [responsiveWidth, setResponsiveWidth] = useState(width);

    useEffect(() => {
        const updateWidth = () => {
            const w = window.innerWidth;

            if (w < 768) setResponsiveWidth(80);
            else if (w < 992) setResponsiveWidth(70);
            else setResponsiveWidth(width);
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
    }, [width]);

    useEffect(() => {
        if (isShow) handleOpen();
        else handleClose();
    }, [isShow]);

    const handleOpen = () => {
        setAnimClass(`offcanvas-show-${placement}`);
        setIsOpen(true);
    };

    const handleClose = () => {
        setAnimClass(`offcanvas-hide-${placement}`);
        setTimeout(() => {
            setIsOpen(false);
            onHide();
        }, 300);
    };

    return (
        <>
        {isOpen && (
            <Offcanvas 
                show={isOpen}
                onHide={handleClose}
                placement={placement}
                className={animClass}
                style={{
                    width: `${responsiveWidth}vw`,
                    height: `${height}vh`
                }}
            >
                {React.Children.map(children, (child) => {
                    if (!React.isValidElement(child)) return child;
                    if ((child.type as any) === Header) {
                        return React.cloneElement(child, { closeButton: true });
                    }
                    return child;
                })}
            </Offcanvas>
        )}
        </>
    );
};


MyOffCanvas.Header = Header;
MyOffCanvas.Body = Body;
MyOffCanvas.Footer = Footer;

export default MyOffCanvas;
