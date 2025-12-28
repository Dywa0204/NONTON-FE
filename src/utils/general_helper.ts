import { Toast } from "@components/reusable/dialogs";
import * as XLSX from "xlsx";

class GeneralHelper {
    static moneyFormat(value: string) {
        const val = value.split('.');
        const decimal = val[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        const comma = val.length > 1 ? val[1] : ''
        const afterComma = comma.substring(0, 2);
        return `${decimal}${val.length > 1 ? ',' : ''}${afterComma}`;
    }

    static capitalizeFirstLetter(str: string) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static printXls = async ({arrayBuffer}: {arrayBuffer: any}) => {
        try {
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const html = XLSX.utils.sheet_to_html(worksheet);
            
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                    <head>
                        <title>Print XLS</title>
                        <style>
                            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
                            td, th { border: 1px solid #999; padding: 4px; text-align: left; }
                        </style>
                    </head>
                    <body>
                        ${html}
                        <script>
                            window.onload = function () {
                                window.print();
                            }
                        </script>
                    </body>
                    </html>
                `);
                printWindow.document.close();
            }
        } catch (err) {
            console.error("Error printing XLS:", err);
        }
    };

    static decodeHtml = (html: string) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    static toastErrorAPI = (error: any, message: string) => {
        if (error.response?.data?.error)
            Toast.error(error.response.data.error);
        else if (error.response?.data?.message)
            Toast.error(error.response.data.message);
        else Toast.error(message)
    }

    static findRolesByPath = (menus: any[], targetPath: string): string[] | null => {
        for (const menu of menus) {
            if (targetPath.includes(menu.path)) return menu.role_access;

            if (Array.isArray(menu.menu_child) && menu.menu_child.length > 0) {
                const found = GeneralHelper.findRolesByPath(menu.menu_child, targetPath);
                if (found) return found;
            }
        }
        return null;
    };

    static extractPath = (path: string) => {
        const actions = ["create", "slot/detail", "edit", "detail", "booking"];
        const parts = path.split("/").filter(Boolean);
    
        const lastIndex = parts.reduce((acc, part, idx) => {
            return actions.includes(part.toLowerCase()) ? idx : acc;
        }, -1);
    
        if (lastIndex === -1) return parts.join("/");
    
        return parts.slice(0, lastIndex).join("/");
    };
    

    static padNumber = (num: number | string, length: number = 8) => {
        return String(num).padStart(length, "0");
    };

    static optionLoader = ({
        formik,
        field,
        page,
        keyword,
        fieldPath,
        result
    }: {
        formik: any,
        field: {
            loading_option: boolean;
            page_option: number;
            option: {
                value: string;
                label: string;
            }[]
        },
        page?: number,
        keyword?: string,
        fieldPath: string,
        fieldName: string,
        result: {
            value: string;
            label: string;
        }[]
    }) => {
        formik.setFieldValue(`${fieldPath}.loading_option`, true);

        try {
            if (page === 1 && keyword) {
                formik.setFieldValue(`${fieldPath}.option`, []);
            }
    
            const before = field.option;
            const combined = [...before, ...result];
            const newOptions = combined.filter(
                (item, index, self) =>
                    index === self.findIndex((t) => t.value === item.value)
            );
            formik.setFieldValue(`${fieldPath}.option`, newOptions);

            const pagePrev = field.page_option
            formik.setFieldValue(`${fieldPath}.page_option`, pagePrev + 1);
        } catch (error) {
            console.error("error", error);
        }
        
        formik.setFieldValue(`${fieldPath}.loading_option`, false);
    }
}

export default GeneralHelper;