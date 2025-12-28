import React, { useState, useRef, DragEvent, FocusEvent, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { AlertTriangle, Edit2, File, Trash } from 'react-feather';
import { Toast } from '../dialogs';

const MyDropZone = ({
    className,
    onFileAdded,
    fileType = "application/pdf"
}: {
    className?: string,
    onFileAdded: (files: File[], fileNames: string[]) => void;
    fileType?: string
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filesAdded, setFilesAdded] = useState<File[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [shouldCallOnFileAdded, setShouldCallOnFileAdded] = useState(false);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };


    /* ===== ON DROP FILE ===== */
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const pdfFiles = Array.from(files).filter(file => file.type === fileType);
            if (pdfFiles.length > 0) {
                addFile(pdfFiles)
            } else {
                Toast.error('Hanya dapat upload file PDF');
            }
        }
    };
    
    
    const handleClick = () => {
        fileInputRef.current?.click();
        
        setIsDragging(true);
        setTimeout(() => {
        const files = fileInputRef.current?.files;
        if (!files || files.length === 0) {
            setIsDragging(false);
        }
        }, 1000);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const pdfFiles = Array.from(files).filter(file => file.type === fileType);
    
            if (pdfFiles.length > 0) {
                addFile(pdfFiles)
            } else {
                Toast.error('Hanya dapat upload file PDF');
            }
    
            setTimeout(() => setIsDragging(false), 1000);
        }
    };
    


    useEffect(() => {
        if (shouldCallOnFileAdded) {
            onFileAdded(filesAdded, fileNames);
            setShouldCallOnFileAdded(false);
        }
    }, [shouldCallOnFileAdded, filesAdded, onFileAdded]);
    


    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setIsDragging(false);
    };

    const borderColor = isDragging ? '#00aaff' : '#cccccc';

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1000) {
            return `${bytes} B`;
        } else if (bytes < 1000 * 1000) {
            return `${(bytes / 1000).toFixed(2)} KB`;
        } else {
            return `${(bytes / (1000 * 1000)).toFixed(2)} MB`;
        }
    }


    const addFile = (pdfFiles: File[]) => {
        setFilesAdded(prevFiles => {
            const updatedFiles = [...prevFiles, ...pdfFiles];
            setFileNames(prevNames => [...prevNames, ...pdfFiles.map(f => f.name)]);
            setShouldCallOnFileAdded(true);
            return updatedFiles;
        });
    }


    const removeFile = (index: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();    
    
        setFilesAdded(prevFiles => {
            const updatedFiles = prevFiles.filter((_, i) => i !== index);
            setShouldCallOnFileAdded(true);
            return updatedFiles;
        });
    
        setFileNames(prev => prev.filter((_, i) => i !== index));
    };
    

    const renameFile = (index: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();   

        const currentName = fileNames[index];
        const newName = prompt("Ubah nama file:", currentName);
        if (newName && newName.trim() !== "") {
            setFileNames(prev => {
                const updated = [...prev];
                updated[index] = newName;
                return updated;
            });
        }
    };    
    

    return (
        <div
            className={`${className}`}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                border: `2px dashed ${borderColor}`,
                textAlign: 'center',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'border-color 0.3s',
            }}
        >
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                onBlur={handleBlur}
                accept={fileType}
                multiple={true}
            />
            {
                filesAdded.length == 0 ? (
                    <p className='m-6'>{isDragging ? 'Letakkan file di sini...' : 'Klik atau Seret file di sini'}</p>
                ) : (
                    <Row className='p-4'>
                        {
                            filesAdded.map((file, index) => (
                                <Col md={3} key={index} className='mb-3'>
                                    <div className="position-relative">
                                        <div className={"p-3 rounded-top-3 " + (file.size > 2000000 ? "bg-danger" : "bg-info")}>
                                            {file.size > 2000000 ? <AlertTriangle size={24} color="white" /> : <File size={24} color="white" />}
                                        </div>
                                        <div className="border">
                                            <h5 className="text-truncate-2 m-3">
                                                {fileNames[index]}
                                                <span className='text-white'>{" "}asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasasdasdasdasd</span>
                                            </h5>
                                            <h4 className="m-3">{formatFileSize(file.size)}</h4>
                                        </div>

                                        <div className="overlay d-flex justify-content-center align-items-center">
                                            <Button variant="info" className="p-2 me-2" onClick={(e) => {renameFile(index, e)}}>
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button variant="danger" className="p-2" onClick={(e) => {removeFile(index, e)}}>
                                                <Trash size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            ))
                        }
                    </Row>
                )
                
            }
        </div>
    );
};

export default MyDropZone;
