import { useEffect, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";

const Header = ({ children }: { children: React.ReactNode }) => (
    <Popover.Header as="h3">{children}</Popover.Header>
);

const Body = ({ children }: { children: React.ReactNode }) => (
    <Popover.Body>{children}</Popover.Body>
);

const MyPopover = ({
    target,
    children,
    isShow,
    placement = "top",
    onHide
}: {
    target: HTMLElement | null;
    children: React.ReactNode;
    isShow: boolean;
    placement?: "top" | "bottom" | "left" | "right";
    onHide: () => void;
}) => {
    const [showPopover, setShowPopover] = useState(isShow);

    useEffect(() => {
        setShowPopover(isShow);
    }, [isShow]);

    const handleClosePopover = () => {
        setShowPopover(false);
        onHide();
    };

    return (
        <Overlay
            show={showPopover}
            target={target}
            placement={placement}
            onHide={handleClosePopover}
            rootClose={true}
        >
            <Popover
                id="popover-basic"
                style={{
                    display: 'inline-block',
                    maxWidth: '90vw',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {children}
            </Popover>
        </Overlay>
    );
};


MyPopover.Header = Header;
MyPopover.Body = Body;


export default MyPopover;
