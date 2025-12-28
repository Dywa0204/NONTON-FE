import { useState } from "react";
import { FileNode, FormState } from "@models/node/node";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { Edit } from "react-feather";
import { putSetMeta } from "@api/api";
import { Sweetalert, Toast } from "@components/reusable/dialogs";
import SyncFiles from "../sync/SyncManager";

type Props = {
    nodeList: FileNode[];
    openItem: (uuid: string) => void;
    fetchData: () => void
};

const Directory = ({ nodeList, openItem, fetchData }: Props) => {
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState<FileNode | null>(null);

    const [form, setForm] = useState<FormState>({
        type: "movie",
        tmdbId: "",
        state: "Unset",
    });

    const openModal = (item: FileNode) => {
        setSelected(item);
        setForm({
            type: (item.meta?.type as FormState["type"]) ?? "movie",
            tmdbId: item.meta?.tmdbId?.toString() ?? "",
            state: (item.meta?.state as FormState["state"]) ?? "Unset",
              season_number: item.meta?.season_number ?? 0,
              episode_number: item.meta?.episode_number ?? 0,
        });
        setShow(true);
    };

    const closeModal = () => {
        setShow(false);
        setSelected(null);
    };

    const onChange = (
        e: any
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async () => {
        Sweetalert.loading("Update Data...")
        try {
            let body: FormState = {
                type: form.type,
                tmdbId: form.tmdbId,
                state: form.state
            }

            if (form.type === "season") {
                body.season_number = form.season_number
                body.episode_number = null
            } else if (form.type === "episode") {
                body.season_number = form.season_number
                body.episode_number = form.episode_number
            } else {
                body.season_number = null
                body.episode_number = null
            }

            console.log("SUBMIT", selected?.uuid, body);
            const response = await putSetMeta(selected?.uuid ?? "", body)
            if (response.status === 200 || response.status === 201) {
                Toast.success("Berhasil") 
                closeModal()
                fetchData()
            }
            else Toast.error("Gagal update Meta")
        } catch (error) {
            Toast.error("Gagal update Meta")
        }

        Sweetalert.close()
    };

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {nodeList.map((item) => (
                        <tr key={item.uuid}>
                            <td>
                                <div
                                onClick={() => openItem(item.uuid)}
                                className="cursor-pointer"
                                >
                                {item.type === "directory" ? "📁" : "🎬"} {item.name}
                                </div>
                            </td>
                        <td>{item.meta?.state ?? "Unset"}</td>
                            <td>
                                <Edit
                                size={16}
                                className="cursor-pointer"
                                onClick={() => openModal(item)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Metadata</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {/* TYPE */}
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select name="type" value={form.type} onChange={onChange}>
                                <option value="movie">Movie</option>
                                <option value="tv">TV</option>
                                <option value="season">Season</option>
                                <option value="episode">Episode</option>
                            </Form.Select>
                        </Form.Group>

                        {/* TMDB ID */}
                        <Form.Group className="mb-3">
                            <Form.Label>TMDB ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="tmdbId"
                                value={form.tmdbId}
                                onChange={onChange}
                            />
                        </Form.Group>

                        {/* STATE */}
                        <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Select name="state" value={form.state} onChange={onChange}>
                                <option value="Unset">Unset</option>
                                <option value="Sync TMDB">Sync TMDB</option>
                                <option value="Manual Set">Manual Set</option>
                                <option value="Extract Subs">Extract Subs</option>
                                <option value="Set Subs">Set Subs</option>
                            </Form.Select>
                        </Form.Group>

                        {/* SEASON NUMBER */}
                        {(form.type === "season" || form.type === "episode") && (
                            <Form.Group className="mb-3">
                                <Form.Label>Season Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="season_number"
                                    value={form.season_number ?? ""}
                                    onChange={onChange}
                                />
                            </Form.Group>
                        )}

                        {/* EPISODE NUMBER */}
                        {form.type === "episode" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Episode Number</Form.Label>
                            <Form.Control
                                type="number"
                                name="episode_number"
                                value={form.episode_number ?? ""}
                                onChange={onChange}
                            />
                        </Form.Group>
                        )}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Directory;
