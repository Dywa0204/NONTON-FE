import { APICore } from "@api/core";
import { FormState } from "@models/node/node";

const api = new APICore();

export const getNodeList = (uuid?: string) => {
    return api.get("files", {params: {uuid}});
}

export const putSetMeta = (uuid: string, body: FormState) => {
    return api.put("meta/" + uuid, body);
}

export const putSetDrive = (drive: string) => {
    return api.put("root-drive", {drive})
}