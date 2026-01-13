import { Box, Card, Typography, useTheme } from "@mui/material";
import useCarousel from "./use-carousel";
import Carousel, { CarouselArrowIndex } from ".";

export function ImageCarouselCard({ title, images, lightbox }: { title: string, images: string[], lightbox: any }) {
    const theme = useTheme();

    const carousel = useCarousel({
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        infinite: images.length > 1,
    });

    if (images.length === 0) {
        return (
            <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>{title}</Typography>
                <Box sx={{
                    height: 200,
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.disabled'
                }}>
                    <Typography variant="caption">Chưa có hình ảnh</Typography>
                </Box>
            </Card>
        );
    }

    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>{title}</Typography>
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                    {images.map((img, index) => (
                        <Box key={index}>
                            <Box
                                component="img"
                                alt={title}
                                src={img}
                                onClick={() => lightbox.onOpen(img)}
                                sx={{
                                    width: 1,
                                    height: 200,
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                }}
                            />
                        </Box>
                    ))}
                </Carousel>

                {images.length > 1 && (
                    <CarouselArrowIndex
                        index={carousel.currentIndex}
                        total={images.length}
                        onNext={carousel.onNext}
                        onPrev={carousel.onPrev}
                        sx={{ bottom: 10, right: 10, position: 'absolute', color: 'common.white', bgcolor: 'rgba(0,0,0,0.48)' }}
                    />
                )}
            </Box>
        </Card>
    );
}
