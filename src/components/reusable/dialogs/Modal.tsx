import React, { ReactNode, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const Header = ({ children, closeButton, className }: { children: React.ReactNode, closeButton?: boolean, className?: string }) => (
    <Modal.Header closeButton={closeButton} className={className}>
        <Modal.Title>{children}</Modal.Title>
    </Modal.Header>
);

const Body = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Modal.Body className={className}>{children}</Modal.Body>
);

const Footer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Modal.Footer className={className}>{children}</Modal.Footer>
);

const MyModal = ({ 
    children, 
    isShow, 
    onHide, 
    size, 
    style,
    dismissable
}: {
    children: ReactNode, 
    isShow: boolean, 
    onHide: any, 
    size: "sm" | "md" | "lg", 
    style?: React.CSSProperties | undefined,
    dismissable?: boolean,
}) => {
    const [isOpen, setIsOpen] = useState(isShow);
    const [animClass, setAnimClass] = useState("");

    useEffect(() => {
        if (isShow) handleOpen();
        else handleClose();
    }, [isShow]);

    const handleOpen = () => {
        setAnimClass("modal-animate-show");
        setIsOpen(true);
    };

    const handleClose = () => {
        setAnimClass("modal-animate-hide");
        setTimeout(() => {
            setIsOpen(false);
            onHide()
        }, 200);
    };
  
    return (
        <Modal 
            animation={true}
            show={isOpen} 
            onHide={handleClose} 
            size={size as "sm" | "lg" | "xl"} 
            className={animClass} 
            style={style}
            backdrop={dismissable ? true : "static"}
        >
            {children}
        </Modal>
    );
};

MyModal.Header = Header;
MyModal.Body = Body;
MyModal.Footer = Footer;

export default MyModal;