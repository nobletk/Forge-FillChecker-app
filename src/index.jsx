import api,
{ route } from '@forge/api';
import ForgeUI,
{
    GlobalPage,
    render,
    Fragment,
    Text,
    DatePicker,
    Form,
    Macro,
    useState,
    Heading,
    UserPicker
} from '@forge/ui';
import { LogTable } from './components';

async function getWorkLogs(id, start_date, end_date) {
    const response = await api.asUser()
        .requestJira(route`/rest/api/latest/search?jql=assignee%20in%20(${id})%20AND%20worklogDate>=${start_date}%20and%20worklogDate<=${end_date}&fields=timespent,reporter,created`,
            {
                headers: { 'Accept': 'application/json' }
            });

    const data = await response.json();
    console.log(`Response: ${response.status} ${response.statusText}`);
    const worklog = [];
    if (data != null) {
        for (var issue = 0; issue < data.total; issue++) {
            const accountId = data.issues[issue].fields.reporter.accountId;
            const key = data.issues[issue].key;
            console.log(data.total);
            const time = (data.issues[issue].fields.timespent) / 3600;
            const date = (data.issues[issue].fields.created).slice(0, 10);
            console.log(`AccountId: ${accountId} ,time: ${time} ,created: ${date}`);
            worklog.push({ issue_key: key, acc_id: accountId, date: date, log_hours: time });
        }
        return worklog;
    }
}

var worklogs = [];
const App = () => {
    const [formState, setFormState] = useState(undefined);
    const onSubmit = async (formData) => {
        formData:
        {
            start_date: 'start_date';
            end_date: 'end_date';
            user: 'user';
        }
        var filter_form = [{ start: formData.start_date, end: formData.end_date, user: formData.user }];
        console.log(filter_form);
        worklogs = await getWorkLogs(formData.user, formData.start_date, formData.end_date);
        setFormState(worklogs);
        console.log(worklogs);
    };

    return (
        <Fragment>
            <Form onSubmit={onSubmit}>
                <Heading size="small">Start Date</Heading>
                <DatePicker name="start_date" onChange={(newValue) => { setValue(newValue); }} />
                <Heading size="small">End Date</Heading>
                <DatePicker name="end_date" onChange={(newValue) => { setValue(newValue); }} />
                <UserPicker name="user" label="User" onChange={(newValue) => { setValue(newValue); }} />
            </Form>
            <LogTable
                logs={worklogs}
            />
        </Fragment>
    );
};

export const run = render(
    <GlobalPage>
        <Macro app={<App />} />
    </GlobalPage>
);
