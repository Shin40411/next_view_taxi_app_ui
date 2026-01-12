import { Helmet } from 'react-helmet-async';
import TestOcrView from 'src/sections/test/test-ocr-view';

export default function TestOcrPage() {
    return (
        <>
            <Helmet>
                <title> Test OCR </title>
            </Helmet>

            <TestOcrView />
        </>
    );
}
