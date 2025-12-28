import React, { createContext, useEffect, useRef, useState } from "react";
import dragula from "dragula";

interface DragGroupContextType {
    registerContainer: (el: HTMLElement) => void;
}

export const DragGroupContext = createContext<DragGroupContextType>({
    registerContainer: () => {},
});

const DragableListGroup = ({
    children,
    onMoved,
    onShadow,
    onDrag
}: {
    children: React.ReactNode;
    onMoved?: (el: Element, target: Element, source: Element) => void;
    onShadow?: (el: Element, container: Element, source: Element) => void;
    onDrag?: (el: Element, source: Element) => void;
}) => {
    const containers = useRef<HTMLElement[]>([]);
    const [containerCount, setContainerCount] = useState(0);
    const drakeRef = useRef<dragula.Drake | null>(null);

    const registerContainer = (el: HTMLElement) => {
        if (!el) return;
        if (!containers.current.includes(el)) {
            containers.current.push(el);
            setContainerCount(containers.current.length);
        }
    };

    useEffect(() => {
        if (containerCount === 0) return;
        if (drakeRef.current) return;

        const drake = dragula(containers.current);
        drakeRef.current = drake;

        drake.on("drop", (el, target, source) => {
            onMoved?.(el, target, source);
        });

        drake.on("shadow", (el, container, source) => {
            onShadow?.(el, container, source)
        })

        drake.on("drag", (el, src) => {
            onDrag?.(el, src)
        })

        return () => {
            drake.destroy();
        };
    }, [containerCount]);

    return (
        <DragGroupContext.Provider value={{ registerContainer }}>
            {children}
        </DragGroupContext.Provider>
    );
};

export default DragableListGroup;
