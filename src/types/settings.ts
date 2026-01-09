export interface ISetting {
    id: number;
    google_client_id: string;
    google_client_secret: string;
    google_callback_url: string;
    zalo_app_id: string;
    zalo_secret_key: string;
    zalo_template_id_otp: string;
    zalo_access_token: string;
    zalo_refresh_token: string;
    mail_host: string;
    mail_port: number;
    mail_user: string;
    mail_pass: string;
    mail_from: string;
}
