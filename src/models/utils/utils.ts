import { ActionMeta, SingleValue } from "react-select"
import { Sidebar as SIDEBAR } from "./sidebar/sidebar"

export namespace Utils {
    export import Sidebar = SIDEBAR

    export interface SelectOption {
        value: string,
        label: string
    }

    export interface InputChangeEvent {
        target: { 
            name: any; 
            value: any; 
        }
    }
}