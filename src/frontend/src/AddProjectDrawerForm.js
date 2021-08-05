import {Drawer, Input, Col, Select, Form, Row, Button, Spin} from 'antd';
import {addNewProject} from "./client";
import {LoadingOutlined} from "@ant-design/icons";
import {useState} from 'react';
import {successNotification, errorNotification} from "./Notification";
const {Option} = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
function ProjectDrawerForm({showDrawer, setShowDrawer, fetchProjects}) {
    const onCLose = () => setShowDrawer(false);
    const [submitting, setSubmitting] = useState(false);
    const onFinish = project => {
        setSubmitting(true)
        console.log(JSON.stringify(project, null, 2))
        addNewProject(project)
            .then(() => {
                console.log("project added")
                onCLose();
                successNotification(
                    "Project successfully added",
                    `${project.name} was added to the system`
                )
                fetchProjects();
            }).catch(err => {
            console.log(err);
            err.response.json().then(res => {
                console.log(res);
                errorNotification(
                    "There was an issue",
                    `${res.message} [${res.status}] [${res.error}]`,
                    "bottomLeft"
                )
            });
        }).finally(() => {
            setSubmitting(false);
        })
    };
    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };
    return <Drawer
        title="Create new project"
        width={720}
        onClose={onCLose}
        visible={showDrawer}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter project name'}]}
                    >
                        <Input placeholder="Please enter project name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="projectNo"
                        label="projectNo"
                        rules={[{required: true, message: 'Please enter project no'}]}
                    >
                        <Input placeholder="Please enter project no"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="projectCode"
                        label="projectCode"
                        rules={[{required: true, message: 'Please enter project code'}]}
                    >
                        <Input placeholder="Please enter project code"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>
        </Form>
    </Drawer>
}
export default ProjectDrawerForm;