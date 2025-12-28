import dragula from "dragula";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

const Header = ({ children }: { children: React.ReactNode }) => (
  <Card.Header className="p-0">
    <div className="p-3">{children}</div>
    <hr className="my-0" />
  </Card.Header>
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
    <div ref={refCallback} className="px-3">
      {children}
    </div>
  );
};
Body.displayName = "DragableListBody";

const DragableList = ({
  children,
  onMoved,
}: {
  children: React.ReactNode;
  onMoved: (target: Element) => void;
}) => {
  const containers = useRef<HTMLElement[]>([]);
  const [isReady, setIsReady] = useState(false);
  const drakeRef = useRef<dragula.Drake | null>(null);

  const onContainerReady = (container: HTMLElement) => {
    containers.current.push(container);
    setIsReady(true);
  };

  useEffect(() => {
    if (!isReady || containers.current.length === 0) return;

    const drake = dragula(containers.current);
    drakeRef.current = drake;

    drake.on("drop", (el, target) => {
      onMoved(target);
    });

    return () => {
      drake.destroy();
    };
  }, [isReady]);

  const enhancedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type as any).displayName === "DragableListBody"
    ) {
      return React.cloneElement(child, {
        onContainerLoaded: onContainerReady,
      });
    }
    return child;
  });

  return <Card className="border p-0">{enhancedChildren}</Card>;
};

DragableList.Body = Body;
DragableList.Header = Header;

export default DragableList;
