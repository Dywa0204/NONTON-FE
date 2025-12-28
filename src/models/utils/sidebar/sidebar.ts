export namespace Sidebar {

    export interface MenuItem {
        href: string,
        icon: string,
        title?: string,
        children?: MenuItem[],
    }

    export interface SidebarState {
        isOpen: boolean;
        menuState: {
          expandedKeys: string[];
        };
    }
}