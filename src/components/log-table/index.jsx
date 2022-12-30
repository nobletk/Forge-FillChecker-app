import ForgeUI, {
    Text,
    Table,
    Head,
    Cell,
    Row,
    Tab,
    Tabs,
    Badge,
    Strong,
    User
} from '@forge/ui';

const req_hours = 5;

export const LogTable = ({ logs }) => {
    if (!logs.length) {
        console.log(`Logs are empty: ${logs.length}`);
        return null;
    }

    return (
        <Table>
            <Head>
                <Cell><Text>Member</Text></Cell>
                <Cell><Text>Details</Text></Cell>
                <Cell><Text>Status</Text></Cell>
            </Head>
            <Row>
                <Cell>
                    <Text>
                        <User accountId={logs[0].acc_id} />
                    </Text>
                </Cell>
                <Cell>
                    <Tabs>
                        {logs.map((log) => {
                            return (
                                <Tab label={log.issue_key}>
                                    <Text>Date: {log.date}</Text>
                                    <Text>Logged hours:
                                        <Badge appearance="default" text={log.log_hours} />
                                    </Text>
                                    <Text>Required hours:
                                        <Badge appearance="primary" text={req_hours} />
                                    </Text>
                                </Tab>
                            )
                        }
                        )}
                    </Tabs>
                </Cell>
                <Cell>
                    {logs.map((log) => {
                        if (log.log_hours >= req_hours) {
                            return (
                                <Text>
                                    <Badge appearance="added" text={log.issue_key} />
                                </Text>
                            )
                        } else {
                            return (
                                <Text>
                                    <Badge appearance="removed" text={log.issue_key} />
                                    <Strong>
                                        Missing hours: {req_hours - log.log_hours}
                                    </Strong>
                                </Text>
                            )
                        }
                    })
                    }
                </Cell>
            </Row>
        </Table>
    )
}