import React, { useContext } from "react";
import { DragGroupContext } from "./DragableListGroup";

const Header = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
);

const Body = ({
    children,
    onContainerLoaded,
}: {
    children: React.ReactNode;
    onContainerLoaded?: (el: HTMLElement) => void;
}) => {
    const refCallback = (el: HTMLElement | null) => {
        if (el && onContainerLoaded) {
            onContainerLoaded(el);
        }
    };

    return (
        <div ref={refCallback}>
            {children}
        </div>
    );
};
Body.displayName = "DragableListBody";

const DragableListV2 = ({ children }: { children: React.ReactNode }) => {
    const { registerContainer } = useContext(DragGroupContext);

    const enhancedChildren = React.Children.map(children, (child) => {
        if (
            React.isValidElement(child) &&
            (child.type as any).displayName === "DragableListBody"
        ) {
            return React.cloneElement(child, {
                onContainerLoaded: registerContainer,
            });
        }
        return child;
    });

    return enhancedChildren;
};

DragableListV2.Body = Body;
DragableListV2.Header = Header;

export default DragableListV2;
