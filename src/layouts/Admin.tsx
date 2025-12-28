import { getNodeList, putSetDrive } from "@api/api";
import { Toast } from "@components/reusable/dialogs";
import { FileNode } from "@models/node/node";
import Directory from "@pages/admin/directory/Directory";
import SyncFiles from "@pages/admin/sync/SyncManager";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const Admin = () => {
    const { "*": rest } = useParams();
    const uuids = rest?.split("/").filter(Boolean) ?? [];

    const navigate = useNavigate();

    const [nodeList, setNodeList] = useState<FileNode[]>([]);
    const [node, setNode] = useState<FileNode | null>(null);
    const [type, setType] = useState<"directory" | "file">("directory");

    const [form, setForm] = useState({
        drive: "G://",
    });

    const onChange = (
        e: any
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchData();
    }, [rest]);

    const fetchData = () => {
        const lastUuid = uuids.at(-1);
        if (lastUuid) {
            fetchChildren(lastUuid);
        } else {
            fetchRoot();
        }
    };

    const fetchChildren = async (uuid: string) => {
        try {
        const response = await getNodeList(uuid);

        if (response.status === 200 || response.status === 201) {
            if (Array.isArray(response.data)) {
                setNodeList(response.data);
                setNode(null);
                setType("directory");
            } else {
                setNode(response.data);
                setNodeList([]);
                setType("file");
            }
        }
        } catch (error) {
            Toast.error("Gagal memuat data");
            navigate("/");
        }
    };

    const fetchRoot = async () => {
        try {
            const response = await getNodeList();

            if (response.status === 200 || response.status === 201) {
                setNodeList(response.data);
                setNode(null);
                setType("directory");
            }
        } catch (error) {
            Toast.error("Gagal memuat direktori");
        }
    };

    const goBack = () => {
        if (uuids.length === 0) {
            navigate("/");
        } else {
            const parentPath = uuids.slice(0, -1).join("/");
            navigate(parentPath ? `/${parentPath}` : "/");
        }
    };

    const openItem = (uuid: string) => {
        const newPath = [...uuids, uuid].join("/");
        navigate(`/${newPath}`);
    };

    const onSetDrive = async () => {
        try {
            const response = await putSetDrive(form.drive)
            if (response.status === 200 || response.status === 201) {
                Toast.success("Berhasil set drive")
            } else {
                Toast.error("Gagal set drive")
            }
        } catch (error) {
            Toast.error("Gagal set drive")
        }
    }

    return (
        <Row>
            <Col md={8}>
                <div style={{ padding: 16 }} className="border m-4 bg-white">
                    {/* BACK BUTTON */}
                    {uuids.length > 0 && (
                        <button onClick={goBack} style={{ marginBottom: 12 }}>
                        ⬅ Kembali
                        </button>
                    )}

                    {/* DIRECTORY VIEW */}
                    {type === "directory" && (
                        <Directory nodeList={nodeList} openItem={openItem} fetchData={fetchData} />
                    )}

                    {/* FILE VIEW */}
                    {type === "file" && node && (
                        <div>
                            <h3>📄 {node.name}</h3>
                            <pre>{JSON.stringify(node, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </Col>

            <Col md={4}>
                <div className="m-4 bg-white border p-4">
                    <div className="mb-2">Working Drive</div>
                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-3">
                                <Form.Select name="drive" value={form.drive} onChange={onChange}>
                                    <option value="C://">C://</option>
                                    <option value="E://">E://</option>
                                    <option value="F://">F://</option>
                                    <option value="G://">G://</option>
                                    <option value="H://">H://</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={onSetDrive}>Save</Button>
                        </Col>
                    </Row>
                </div>

                <SyncFiles fetchData={fetchData} />
            </Col>
        </Row>
    );
};

export default Admin;
