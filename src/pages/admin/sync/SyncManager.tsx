import React, { useState, useRef, useEffect } from 'react';
import { apiConfig } from '../../../../src/config';
import { Button } from 'react-bootstrap';

// Tipe data untuk pesan SSE dari backend
interface SyncSummary {
    totalFiles: number;
    rootChildren: number;
}

interface SyncPayload {
    status: 'start' | 'progress' | 'done' | 'error';
    message: string;
    summary?: SyncSummary;
}

const SyncFiles = ({fetchData}: {fetchData: () => void}) => {
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const eventSourceRef = useRef<EventSource | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log ke bawah
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Cleanup saat unmount
    useEffect(() => {
        return () => {
            closeConnection();
        };
    }, []);

    const closeConnection = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsSyncing(false);
    };

    const handleSync = () => {
        if (isSyncing) return;

        setIsSyncing(true);
        setLogs([]);
        setError(null);
        
        const sseUrl = `${apiConfig.BASE_URL}/sync`; 
        
        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
        console.log("SSE Connection Opened");
        };

        eventSource.onmessage = (event) => {
        try {
            // Backend mengirim format: res.write(`data: ${JSON.stringify(...)}\n\n`);
            const data: SyncPayload = JSON.parse(event.data);

            switch (data.status) {
            case 'start':
                setLogs(prev => [...prev, `🚀 [START] ${data.message}`]);
                break;
            
            case 'progress':
                // Limit log agar tidak memberatkan browser jika file ribuan
                setLogs(prev => {
                    const newLogs = [...prev, `> ${data.message}`];
                    return newLogs.slice(-100); 
                });
                break;

            case 'done':
                setLogs(prev => [...prev, `✅ [DONE] ${data.message}`]);
                if (data.summary) {
                    setLogs(prev => [...prev, `📊 Summary: ${data.summary?.totalFiles} files processed.`]);
                }
                closeConnection();
                fetchData()
                break;

            case 'error':
                setError(data.message);
                setLogs(prev => [...prev, `❌ [ERROR] ${data.message}`]);
                closeConnection();
                break;
            }
        } catch (err) {
            console.error("Failed to parse SSE message", err);
        }
        };

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            setError("Connection lost or server error.");
            closeConnection();
        };
    };

    return (
        <div className='m-4 p-4 border bg-white'>
            <div className='d-flex justify-content-between'>
                <h5>Sync Files</h5>
                <Button variant="primary" disabled={isSyncing} onClick={handleSync}>Start</Button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
                    {error}
                </div>
            )}

            <div>
                {
                    logs.length === 0 ? ( <p className="text-gray-500 italic m-0">Ready to sync files from root drive...</p> ) : (
                    logs.map((log, index) => (
                        <div key={index}><small>{log}</small></div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default SyncFiles;