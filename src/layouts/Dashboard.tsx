import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Wrapper from "@components/reusable/Wrapper";
import Main from "@components/reusable/Main";
import Navbar from "@components/navbar/Navbar";
import Content from "@components/reusable/Content";
import Footer from "@components/footer/Footer";
import Loader from "@components/reusable/Loader";

import Sidebar from "@components/sidebar/Sidebar";
import { Utils } from "@models/index";
import { Settings } from "@models/index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchMenu } from "@redux/slices/admin/settings/menu/menuSlice";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [navMenuItems, setNavMenuItems] = useState<{ title: string; pages: Utils.Sidebar.MenuItem[] }[]>([]);
  
  const { data, param } = useSelector((state: RootState) => state.admin.settings.menu);
  const { profile } = useSelector((state: RootState) => state.admin.masterdata.user);
  const userRole = profile.role;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data?.data) generateMenu();
  }, [data]);

  const generateMenu = () => {
    const menus = data.data as Settings.Menu.Data[];

    const getMenu = (rawMenus?: Settings.Menu.Data[]): Utils.Sidebar.MenuItem[] => {
      if (!Array.isArray(rawMenus)) return [];

      return rawMenus
        .filter((menu) => menu.role_access?.includes(userRole))
        .map((menu) => ({
          href: menu.path,
          icon: menu.icon,
          title: menu.name,
          children:
            Array.isArray(menu.menu_child) && menu.menu_child.length > 0
              ? getMenu(menu.menu_child)
              : undefined,
        }));
    };

    setNavMenuItems([
      {
        title: "",
        pages: getMenu(menus),
      },
    ]);
  };

  const loadData = async () => {
    dispatch(fetchMenu(param));
  };

  return (
    <Wrapper>
      <Sidebar item={navMenuItems} />
      <Main>
        <Navbar />
        <Content>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Content>
        <Footer />
      </Main>
    </Wrapper>
  );
};

export default Dashboard;
