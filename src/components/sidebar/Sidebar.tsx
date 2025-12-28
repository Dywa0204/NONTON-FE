import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";

import FG_ICON from "@assets/img/favicon.ico";
import SidebarMenuTree from "./SidebarMenuTree";
import { Utils } from "@models/index";
import { Link } from "react-router-dom";

const Sidebar = ({
    item
}: {
    item: {title: string; pages: Utils.Sidebar.MenuItem[];}[]
}) => {
    
    const isOpen = useSelector((state: RootState) => state.utils.sidebar.isOpen)
    
    return (
        <nav className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
            <div className="sidebar-content">
                <PerfectScrollbar>
                    <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
                        <img src={FG_ICON} alt="Logo" width="32px" height="32px"/>
                        <span className="align-middle ms-2">Antrian Co-Ass</span>
                    </Link>

                    <div className="px-4 mb-4">
                        {
                            item.map((page, index) => (
                                <SidebarMenuTree data={page.pages} key={index} /> 
                            ))
                        }
                    </div>
                </PerfectScrollbar>
            </div>
        </nav>
    )
}

export default Sidebar;