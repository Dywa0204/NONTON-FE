import dragula from "dragula";
import React, {
    useEffect,
    useRef,
    ReactNode,
    ReactElement,
    cloneElement,
} from "react";
import { Table, TableProps } from "react-bootstrap";

interface DragableTableProps extends TableProps {
    children: ReactNode;
    onMoved?: (target: Element) => void;
    disableSort?: boolean;
}

const DragableTable = ({
    children,
    onMoved,
    disableSort = false,
    ...tableProps
}: DragableTableProps) => {
    const tbodyRef = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
        if (!tbodyRef.current || disableSort) return;

        const drake = dragula([tbodyRef.current], {
            moves: (_el, _source, handle) => {
                return handle!.classList.contains("drag-handle");
            },
        });

        drake.on("drop", (_el, target) => {
            if (onMoved) {
                onMoved(target);
            }
        });

        return () => {
            drake.destroy();
        };
    }, [onMoved, disableSort]);

    let thead: ReactNode = null;
    let tbody: ReactNode = null;

    React.Children.forEach(children, (child) => {
        if (!child || typeof child !== "object" || !("type" in child)) return;

        const element = child as ReactElement;

        if (element.type === "thead") {
            thead = element;
        } else if (element.type === "tbody") {
            tbody = cloneElement(element, { ref: tbodyRef });
        }
    });

    return (
        <Table {...tableProps}>
            {thead}
            {tbody}
        </Table>
    );
};

export default DragableTable;
