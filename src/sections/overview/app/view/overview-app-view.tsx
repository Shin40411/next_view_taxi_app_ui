import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

// import { useMockedUser } from 'src/hooks/use-mocked-user';

// import { SeoIllustration } from 'src/assets/illustrations';
// import { _appAuthors } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

// import AppWidget from '../app-widget';
// import AppWelcome from '../app-welcome';
// import AppFeatured from '../app-featured';
// import AppNewInvoice from '../app-new-invoice';
// import AppTopAuthors from '../app-top-authors';
// import AppTopRelated from '../app-top-related';
// import AppAreaInstalled from '../app-area-installed';
// import AppTopAuthors from '../app-top-authors';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
// import AppTopInstalledCountries from '../app-top-installed-countries';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  // const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

        <Grid xs={12} md={6} lg={6}>
          <AppCurrentDownload
            title="Thống kê tài nguyên"
            chart={{
              series: [
                { label: 'Hình ảnh', value: 12244 },
                { label: 'Video', value: 53345 },
                { label: 'Tập tin khác', value: 44313 },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New Invoice"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid> */}

        <Grid xs={12} md={6} lg={6}>
          <Stack spacing={3}>
            <AppWidgetSummary
              title="Hình ảnh"
              total={18765}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }} percent={0}
            />
            <AppWidgetSummary
              title="Video"
              total={4876}
              chart={{
                colors: [theme.palette.info.light, theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
              percent={0}
            />
            <AppWidgetSummary
              title="Tập tin khác"
              total={678}
              chart={{
                colors: [theme.palette.warning.light, theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }} percent={0} />
          </Stack>
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
