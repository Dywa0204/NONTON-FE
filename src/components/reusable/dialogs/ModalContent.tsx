import React, { ReactNode, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

type ModalContentSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalContentProps {
    children: ReactNode;
    isShow: boolean;
    onHide: () => void;
    size?: ModalContentSize;
    style?: React.CSSProperties;
    dismissable?: boolean;
}

const ModalContent: React.FC<ModalContentProps> & {
    Header: typeof Header;
    Body: typeof Body;
    Footer: typeof Footer;
} = ({
    children,
    isShow,
    onHide,
    size = 'md',
    style,
    dismissable = true,
}) => {
        const [isOpen, setIsOpen] = useState(isShow);
        const [animClass, setAnimClass] = useState('');

        useEffect(() => {
            isShow ? handleOpen() : handleClose();
        }, [isShow]);

        const handleOpen = () => {
            setAnimClass('modal-animate-show');
            setIsOpen(true);
        };

        const handleClose = () => {
            setAnimClass('modal-animate-hide');
            setTimeout(() => {
                setIsOpen(false);
                onHide();
            }, 200);
        };

        return (
            <Modal
                animation
                show={isOpen}
                onHide={handleClose}
                size={size === 'md' ? undefined : size}
                className={animClass}
                style={style}
                backdrop={dismissable ? true : 'static'}
            >
                {children}
            </Modal>
        );
    };

const Header = ({
    children,
    closeButton = true,
    className,
}: {
    children: ReactNode;
    closeButton?: boolean;
    className?: string;
}) => (
    <Modal.Header closeButton={closeButton} className={className}>
        <Modal.Title>{children}</Modal.Title>
    </Modal.Header>
);

const Body = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => <Modal.Body className={className}>{children}</Modal.Body>;

const Footer = ({
    children,
    className
}: {
    children: ReactNode;
    className?: string;
}) => <Modal.Footer className={className}>{children}</Modal.Footer>;

ModalContent.Header = Header;
ModalContent.Body = Body;
ModalContent.Footer = Footer;

export default ModalContent;