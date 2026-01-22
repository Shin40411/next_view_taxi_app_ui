import { Box, Button, Snackbar, Typography, CircularProgress } from "@mui/material";

import Iconify from "../iconify";

const CustomSnackBar = ({
    open,
    title,
    snackbarPlaceholder,
    isProcessing,
    handleEvent,
    cancelProcessing,
}) => (
        <Snackbar
            open={open}
            autoHideDuration={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            sx={{
                "& .MuiSnackbarContent-root": {
                    backgroundColor: "#fff",
                    color: "#1E1F22",
                    borderRadius: 2,
                    boxShadow: "0px 0px 12px rgba(160, 92, 255, 0.5)",
                    padding: "8px 16px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "500px",
                    width: "100%",
                },
                "& .MuiSnackbarContent-message": {
                    width: "100%",
                }
            }}
            message={
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    overflow: "hidden",
                }}>
                    <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                        <Iconify icon="eva:cloud-upload-fill" width={24} style={{ marginRight: 8 }} />
                        <Typography
                            variant="body2"
                            sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                flexGrow: 1,
                            }}
                        >
                            {snackbarPlaceholder}
                        </Typography>
                    </Box>

                    <Box display="flex" gap={1} ml={2}>
                        <Button
                            size="small"
                            sx={{
                                background: "linear-gradient(135deg, #A05CFF 0%, #FF5CAB 100%)",
                                color: "#fff",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": { opacity: 0.8 },
                            }}
                            disabled={isProcessing}
                            onClick={handleEvent}
                        >
                            {isProcessing ? (
                                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                                    <CircularProgress size={18} color="inherit" />
                                </Box>
                            ) : (
                                {title}
                            )}
                        </Button>

                        <Button
                            size="small"
                            sx={{
                                background: "#444",
                                color: "#fff",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": { background: "#666" },
                            }}
                            disabled={isProcessing}
                            onClick={cancelProcessing}
                        >
                            Huỷ bỏ
                        </Button>
                    </Box>
                </Box>
            }
        />
    );

export default CustomSnackBar;
