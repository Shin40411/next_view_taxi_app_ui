import { useMemo } from 'react';
import { useOcr } from 'src/hooks/api/use-ocr';

// ----------------------------------------------------------------------

export interface IdentityCardData {
    id: string;
    fullName: string;
    dob: string;
    sex: string;
    nationality: string;
    placeOfOrigin: string;
    placeOfResidence: string;
}

interface UseScanIdentityCardReturn {
    scanIdentityCard: (file: File | string) => Promise<IdentityCardData | null>;
    scanIdentityCardBack: (file: File | string) => Promise<boolean>;
    parsedData: IdentityCardData | null;
    loading: boolean;
    error: string | null;
    rawData: any;
}

export function useScanIdentityCard(): UseScanIdentityCardReturn {
    const { scanImage, loading, error, data } = useOcr();

    const scanIdentityCard = async (file: File | string): Promise<IdentityCardData | null> => {
        const response = await scanImage(file, { language: 'vnm' });

        if (!response || response.IsErroredOnProcessing || !response.ParsedResults?.[0]?.ParsedText) {
            return null;
        }

        const text = response.ParsedResults[0].ParsedText;
        const result: IdentityCardData = {
            id: '',
            fullName: '',
            dob: '',
            sex: '',
            nationality: '',
            placeOfOrigin: '',
            placeOfResidence: '',
        };

        const extract = (pattern: RegExp) => {
            const match = text.match(pattern);
            return match ? match[1].trim() : '';
        };

        result.id = extract(/Số\s*\/\s*No\.?\s*:?\s*(\d+)/i);
        result.fullName = extract(/Họ\s*và\s*tên\s*\/\s*Full\s*name\.?\s*:?\s*([^\n]+)/i);
        const dobLabelMatch = text.match(/Ngày\s*sinh\s*\/\s*Date\s*of\s*birth/i);
        if (dobLabelMatch && dobLabelMatch.index !== undefined) {
            const textAfterLabel = text.slice(dobLabelMatch.index + dobLabelMatch[0].length);
            const dobMatch = textAfterLabel.match(/(\d{2}\/\d{2}\/\d{4})/);
            if (dobMatch) {
                result.dob = dobMatch[0];
            }
        }
        result.sex = extract(/Giới\s*tính\s*\/\s*Sex\s*:?\s*([^\n]+)/i);
        result.nationality = extract(/Quốc\s*tịch\s*\/\s*Nationality\s*:?\s*([^\n]+)/i);
        result.placeOfOrigin = extract(/Quê\s*quán\s*\/\s*Place\s*of\s*origin\s*:?\s*([^\n]+)/i);

        const residenceMatch = text.match(/Nơi\s*thường\s*trú\s*\/\s*Place\s*of\s*residence\s*:?([\s\S]*?)(?:$|Cục|Date|Gen|Giám)/i);
        if (residenceMatch) {
            result.placeOfResidence = residenceMatch[1].replace(/\n/g, ' ').trim();
        }

        return result;
    };

    const scanIdentityCardBack = async (file: File | string): Promise<boolean> => {
        const response = await scanImage(file, { language: 'vnm' });

        if (!response || response.IsErroredOnProcessing || !response.ParsedResults?.[0]?.ParsedText) {
            return false;
        }

        const text = response.ParsedResults[0].ParsedText;
        return text.includes('<<<');
    };

    const parsedData = useMemo(() => {
        if (!data?.ParsedResults?.[0]?.ParsedText) return null;

        const text = data.ParsedResults[0].ParsedText;
        const result: IdentityCardData = {
            id: '',
            fullName: '',
            dob: '',
            sex: '',
            nationality: '',
            placeOfOrigin: '',
            placeOfResidence: '',
        };

        const extract = (pattern: RegExp) => {
            const match = text.match(pattern);
            return match ? match[1].trim() : '';
        };

        result.id = extract(/Số\s*\/\s*No\.?\s*:?\s*(\d+)/i);
        result.fullName = extract(/Họ\s*và\s*tên\s*\/\s*Full\s*name\.?\s*:?\s*([^\n]+)/i);
        result.dob = extract(/Ngày\s*sinh\s*\/\s*Date\s*of\s*birth\s*:?\s*([^\n]+)/i).replace('/', '');
        result.sex = extract(/Giới\s*tính\s*\/\s*Sex\s*:?\s*([^\n]+)/i);
        result.nationality = extract(/Quốc\s*tịch\s*\/\s*Nationality\s*:?\s*([^\n]+)/i);
        result.placeOfOrigin = extract(/Quê\s*quán\s*\/\s*Place\s*of\s*origin\s*:?\s*([^\n]+)/i);

        const residenceMatch = text.match(/Nơi\s*thường\s*trú\s*\/\s*Place\s*of\s*residence\s*:?([\s\S]*?)(?:$|Cục|Date|Gen|Giám)/i);
        if (residenceMatch) {
            result.placeOfResidence = residenceMatch[1].replace(/\n/g, ' ').trim();
        }

        return result;
    }, [data]);

    return {
        scanIdentityCard,
        scanIdentityCardBack,
        parsedData,
        loading,
        error,
        rawData: data,
    };
}
