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
    email_receive: string;
    send_report_mail: boolean;
    time_report_mail: string | null;
    send_reminder_mail: boolean;
    time_reminder_mail: string | null;
    receive_support_mail: boolean;

    tpl_trip_request: string;
    tpl_driver_arrived: string;
    tpl_trip_cancelled: string;
    tpl_trip_confirmed: string;
    tpl_trip_rejected: string;
    tpl_wallet_success: string;
    tpl_wallet_failed: string;
    tpl_contract_approved: string;
    tpl_contract_terminated: string;
}
