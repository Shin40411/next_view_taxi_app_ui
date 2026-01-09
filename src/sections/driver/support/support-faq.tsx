import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// components
import Iconify from 'src/components/iconify';
// hooks
import { useSupport } from 'src/hooks/api/use-support';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

export default function SupportFaq() {
    const { useGetFaqs } = useSupport();
    const { faqs, faqsLoading } = useGetFaqs(1, 100); // Get up to 100 FAQs

    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader title="Câu hỏi thường gặp" />
            <CardContent>
                {faqsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {faqs.map((faq, index) => (
                            <Accordion key={index}>
                                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                                    <Typography variant="subtitle2">{faq.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                        {faqs.length === 0 && (
                            <EmptyContent
                                title="Không có câu hỏi"
                                description="Không có câu hỏi nào."
                            />
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
