import { useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

type OcrLanguage = 'eng' | 'vnm' | 'chs' | 'cht' | 'kor' | 'jpn';

export interface OcrOptions {
    language?: OcrLanguage;
    isOverlayRequired?: boolean;
    isCreateSearchablePdf?: boolean;
    isSearchablePdfHideTextLayer?: boolean;
}

export interface OcrResponse {
    ParsedResults: Array<{
        ParsedText: string;
        ErrorMessage: string;
        ErrorDetails: string;
        TextOverlay: any;
        FileParseExitCode: number;
    }>;
    OCRExitCode: number;
    IsErroredOnProcessing: boolean;
    ErrorMessage: string[];
    ErrorDetails: string;
}

interface UseOcrReturn {
    scanImage: (file: File | string, options?: OcrOptions) => Promise<OcrResponse | null>;
    loading: boolean;
    error: string | null;
    data: OcrResponse | null;
}

export function useOcr(): UseOcrReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<OcrResponse | null>(null);

    const scanImage = async (file: File | string, options?: OcrOptions) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const formData = new FormData();

            // API Key
            const apiKey = import.meta.env.VITE_OCR_API_KEY;
            if (!apiKey) {
                throw new Error('OCR API Key is missing in environment variables.');
            }
            formData.append('apikey', apiKey);

            // Options
            formData.append('language', options?.language || 'eng');
            formData.append('isOverlayRequired', String(options?.isOverlayRequired ?? false));
            formData.append('ocrengine', '2');
            formData.append('iscreatesearchablepdf', String(options?.isCreateSearchablePdf ?? false));
            formData.append('issearchablepdfhidetextlayer', String(options?.isSearchablePdfHideTextLayer ?? false));

            // File or URL
            if (typeof file === 'string') {
                formData.append('url', file);
            } else {
                formData.append('file', file);
            }

            const response = await axios.post<OcrResponse>('https://api.ocr.space/parse/image', formData);

            if (response.data.IsErroredOnProcessing) {
                const errorMsg = response.data.ErrorMessage?.join(', ') || 'OCR Processing Error';
                setError(errorMsg);
                return null;
            }

            setData(response.data);
            return response.data;

        } catch (err: any) {
            console.error('OCR Error:', err);
            const errorMsg = err.message || 'Failed to connect to OCR service';
            setError(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        scanImage,
        loading,
        error,
        data,
    };
}
