import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Row, Col, ListGroup, Form, Badge, Alert } from 'react-bootstrap';
import { FileNode } from '@models/node/node'; 
import { APICore } from '../../../api/core'; // Sesuaikan path import APICore Anda
import { apiConfig } from '../../../config';  // Sesuaikan path import apiConfig Anda

interface FileDetailProps {
    node: FileNode;
    refreshData: () => void;
}

interface TempSubtitle {
    filename: string;
    extractedPath: string;
    label: string;
    language: string;
}

const FileDetail: React.FC<FileDetailProps> = ({ node, refreshData }) => {
    const api = new APICore();
    const [extracting, setExtracting] = useState(false);
    const [extractLogs, setExtractLogs] = useState<string[]>([]);
    const [tempSubs, setTempSubs] = useState<TempSubtitle[]>([]);
    const [selectedLangs, setSelectedLangs] = useState<Record<string, string>>({});

    const logsEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const streamUrl = `${apiConfig.BASE_URL}/stream/${node.uuid}`;
    const downloadUrl = `${apiConfig.BASE_URL}/download/file/${node.uuid}`;

    // Load temp subtitles on mount
    useEffect(() => {
        fetchTempSubtitles();
        return () => closeSSE();
    }, [node.uuid]);

    // Auto scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [extractLogs]);

    const fetchTempSubtitles = async () => {
        try {
            const res = await api.get(`/subtitles/temp/${node.uuid}`);
            if (res.data) setTempSubs(res.data);
        } catch (error) {
            console.error("Failed to fetch temp subs", error);
        }
    };

    const handleDownload = () => {
        window.open(downloadUrl, '_blank');
    };

    // --- SSE EXTRACT SUBTITLES ---
    const handleExtract = () => {
        if (extracting) return;
        setExtracting(true);
        setExtractLogs([]);

        const sseUrl = `${apiConfig.BASE_URL}/subtitles/extract/${node.uuid}`;
        const evtSource = new EventSource(sseUrl);
        eventSourceRef.current = evtSource;

        evtSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.status === 'start') {
                    setExtractLogs(prev => [...prev, `🚀 ${data.message}`]);
                } else if (data.status === 'progress') {
                    // Update log terakhir jika itu progress, atau tambah baru
                    setExtractLogs(prev => [...prev, `> Progress: ${data.percent}%`]);
                } else if (data.status === 'done') {
                    setExtractLogs(prev => [...prev, `✅ ${data.message}`]);
                    closeSSE();
                    fetchTempSubtitles(); // Refresh list setelah extract
                } else if (data.status === 'error') {
                    setExtractLogs(prev => [...prev, `❌ Error: ${data.message}`]);
                    closeSSE();
                }
            } catch (err) { console.error(err); }
        };

        evtSource.onerror = () => {
            setExtractLogs(prev => [...prev, "❌ Connection lost"]);
            closeSSE();
        };
    };

    const closeSSE = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setExtracting(false);
    };

    // --- SET SUBTITLE LANGUAGE & SAVE ---
    const handleSaveSubtitle = async (sub: TempSubtitle) => {
        const lang = selectedLangs[sub.filename] || 'en';
        const label = `${lang.toUpperCase()} - ${sub.filename}`;

        try {
            await api.put(`/subtitles/${node.uuid}`, {
                label,
                language: lang,
                extractedPath: sub.extractedPath
            });
            alert("Subtitle added successfully!");
            refreshData(); // Refresh node data di parent untuk update list subtitle aktif
            fetchTempSubtitles(); // Refresh temp list
        } catch (error) {
            alert("Failed to add subtitle");
        }
    };

    return (
        <div className="p-3">
            <h3 className="mb-3">📄 {node.name}</h3>
            
            <Row>
                {/* === PLAYER & INFO === */}
                <Col md={8}>
                    <Card className="shadow-sm mb-4 border">
                        <Card.Body className="p-0 bg-black text-center">
                            {/* STREAMING VIDEO PLAYER */}
                            <video 
                                controls 
                                width="100%" 
                                height="auto" 
                                style={{ maxHeight: '500px' }}
                                crossOrigin="anonymous"
                            >
                                <source src={streamUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-between align-items-center">
                            <div>
                                <Badge bg="info" className="me-2">Size: {(node.size / 1024 / 1024).toFixed(2)} MB</Badge>
                                <Badge bg="secondary">Type: {node.meta?.type || 'Video'}</Badge>
                            </div>
                            <Button variant="primary" onClick={handleDownload}>
                                <i className="mdi mdi-download me-1"></i> Download File
                            </Button>
                        </Card.Footer>
                    </Card>

                    {/* === EXISTING SUBTITLES === */}
                    <Card className="mb-4 border">
                        <Card.Header>Active Subtitles</Card.Header>
                        <ListGroup variant="flush">
                            {node.subtitles && node.subtitles.length > 0 ? (
                                node.subtitles.map((sub: any, idx: number) => (
                                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                                        <span>
                                            <Badge bg="success" className="me-2">{sub.language}</Badge>
                                            {sub.label}
                                        </span>
                                        <Button 
                                            size="sm" 
                                            variant="outline-secondary" 
                                            onClick={() => window.open(`${apiConfig.BASE_URL}/${sub.path}`, '_blank')}
                                        >
                                            Download
                                        </Button>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item className="text-muted">No subtitles attached.</ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>

                {/* === TOOLS SECTION === */}
                <Col md={4}>
                    {/* EXTRACTOR */}
                    <Card className="mb-3 border">
                        <Card.Header className="bg-dark text-white">Subtitle Extractor</Card.Header>
                        <Card.Body>
                            <Button 
                                variant={extracting ? "secondary" : "warning"} 
                                className="w-100 mb-3"
                                onClick={handleExtract}
                                disabled={extracting}
                            >
                                {extracting ? 'Extracting...' : 'Extract Embedded Subs'}
                            </Button>
                            
                            <div className="bg-black text-success p-2 rounded" style={{ height: '150px', overflowY: 'auto', fontSize: '12px', fontFamily: 'monospace' }}>
                                {extractLogs.map((log, i) => <div key={i}>{log}</div>)}
                                <div ref={logsEndRef} />
                            </div>
                        </Card.Body>
                    </Card>

                    {/* TEMP SUBTITLES LIST */}
                    {tempSubs.length > 0 && (
                        <Card className="border-info border">
                            <Card.Header className="bg-info text-white">Extracted Candidates</Card.Header>
                            <Card.Body className="p-2">
                                {tempSubs.map((sub, idx) => (
                                    <Card key={idx} className="mb-2 shadow-sm">
                                        <Card.Body className="p-2">
                                            <div className="small fw-bold text-truncate mb-2" title={sub.filename}>
                                                {sub.filename}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Form.Select 
                                                    size="sm"
                                                    value={selectedLangs[sub.filename] || ''}
                                                    onChange={(e) => setSelectedLangs({...selectedLangs, [sub.filename]: e.target.value})}
                                                >
                                                    <option value="">Set Lang...</option>
                                                    <option value="en">English (en)</option>
                                                    <option value="id">Indonesia (id)</option>
                                                    <option value="jp">Japan (jp)</option>
                                                </Form.Select>
                                                <Button 
                                                    size="sm" 
                                                    variant="success"
                                                    disabled={!selectedLangs[sub.filename]}
                                                    onClick={() => handleSaveSubtitle(sub)}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default FileDetail;