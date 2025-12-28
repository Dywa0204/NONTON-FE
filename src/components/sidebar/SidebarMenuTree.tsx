import { ChevronRight, ChevronDown } from "react-feather";
import { useEffect, useRef, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { toggleMenu } from "@redux/slices/utils/sidebar/sidebarSlice";
import { Utils } from "@models/index";
import { Link, useLocation } from "react-router-dom";

const normalize = (p: string) => {
    if (!p) return "";
    try {
        const u = new URL(p, window.location.origin);
        p = u.pathname;
    } catch (_) {}
    return ("/" + p).replace(/\/+$/, "");
};

const getMenuNow = (path: string, href?: string) => {
    if (!path || !href) return false;
    const normalizedPath = normalize(path);
    const normalizedHref = normalize(href);

    if (normalizedPath === normalizedHref) return true;
    if (normalizedHref !== "/" && normalizedPath.startsWith(normalizedHref + "/"))
        return true;
    return false;
};

const SidebarMenuItem = memo(
    ({
        item,
        index,
        depth,
        parentKey,
        isLast,
    }: {
        item: Utils.Sidebar.MenuItem;
        index: number;
        depth: number;
        parentKey: string;
        isLast: boolean;
    }) => {
        const dispatch = useDispatch();
        const expandedKeys = useSelector(
            (state: RootState) => state.utils.sidebar.menuState.expandedKeys
        );
        const location = useLocation();
        const pathNow = location.pathname;

        const keyId = parentKey ? `${parentKey}-${index}` : `${index}`;
        const isActivePath = getMenuNow(pathNow, item.href);
        const isExpanded = item.children ? expandedKeys.includes(keyId) : false;

        const titleRef = useRef<HTMLAnchorElement>(null);
        const [titleHeight, setTitleHeight] = useState(0);
        const lastItemRef = useRef<HTMLDivElement>(null);
        const [lastItemHeight, setLastItemHeight] = useState(0);

        useEffect(() => {
            if (item.children && isActivePath && !expandedKeys.includes(keyId)) {
                dispatch(toggleMenu(keyId));
            }
        }, [isActivePath, item.children, keyId, expandedKeys, dispatch]);

        useEffect(() => {
            setTitleHeight(titleRef.current?.clientHeight ?? 0);
        }, [isExpanded]);

        useEffect(() => {
            if (isLast && depth !== 0) {
                setLastItemHeight(lastItemRef.current?.clientHeight ?? 0);
            }
        }, [isLast, depth, expandedKeys]);

        const handleToggleMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (item.children) {
                e.preventDefault();
                dispatch(toggleMenu(keyId));
            }
        };

        return (
            <div
                key={keyId}
                className="mt-3 position-relative"
                style={{ marginLeft: depth !== 0 ? `20px` : "0" }}
                ref={lastItemRef}
            >
                {depth !== 0 && !isLast && (
                    <div className="sidebar-item-branch"></div>
                )}

                <Link
                    to={item.children ? "#" : item.href || "#"}
                    ref={titleRef}
                    className={`sidebar-item-title ${
                        isActivePath ? "active" : ""
                    } text-light`}
                    onClick={handleToggleMenu}
                >
                    <div style={{ display: "flex", gap: "8px" }}>
                        <i
                            className={`bi bi-${
                                item.icon ??
                                (!item.children
                                    ? "bi-arrow-up-right-circle"
                                    : "bi-folder")
                            }`}
                        ></i>
                        {item.title}
                    </div>

                    {item.children && (
                        <span style={{ display: "flex", alignItems: "center" }}>
                            {isExpanded ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </span>
                    )}
                </Link>

                {item.children && isExpanded && (
                    <div
                        className="sidebar-item-logs"
                        style={{
                            height: `calc(100% - ${titleHeight + 16}px)`,
                            top: `${titleHeight}px`,
                        }}
                    ></div>
                )}

                {isLast && depth !== 0 && (
                    <div
                        className="sidebar-last-branch"
                        style={{ height: lastItemHeight + 18 + "px" }}
                    >
                        <div className="sidebar-last-branch-child"></div>
                    </div>
                )}

                {item.children && (
                    <div
                        className="sidebar-item-branch-child"
                        style={{
                            maxHeight: isExpanded ? "1000px" : "0",
                            overflow: "hidden",
                            transition: "max-height 0.3s ease",
                        }}
                    >
                        {isExpanded && (
                            <SidebarMenuTree
                                data={item.children}
                                depth={depth + 1}
                                parentKey={keyId}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
);


const SidebarMenuTree = ({
    data,
    depth = 0,
    parentKey = "",
}: {
    data: Utils.Sidebar.MenuItem[];
    depth?: number;
    parentKey?: string;
}) => {
    return (
        <>
            {data.map((item, index) => (
                <SidebarMenuItem
                    key={`${parentKey}-${index}`}
                    item={item}
                    index={index}
                    depth={depth}
                    parentKey={parentKey}
                    isLast={index === data.length - 1}
                />
            ))}
        </>
    );
};

export default SidebarMenuTree;
