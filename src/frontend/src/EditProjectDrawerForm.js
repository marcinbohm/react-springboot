import {Drawer, Input, Col, Select, Form, Row, Button, Spin} from 'antd';
import {updateProject} from "./client";
import {LoadingOutlined} from "@ant-design/icons";
import {useState} from 'react';
import {successNotification, errorNotification} from "./Notification";
const {Option} = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
function ProjectEditDrawerForm({showEditDrawer, setEditShowDrawer, fetchProjects}) {
    const onCLose = () => setEditShowDrawer(false);
    const [submitting, setSubmitting] = useState(false);
    const onFinish = project => {
        setSubmitting(true)
        console.log(JSON.stringify(project, null, 2))
        updateProject(project)
            .then(() => {
                console.log("project updated")
                alert(JSON.stringify(project, null, 2))
                onCLose();
                successNotification(
                    "Project successfully updated",
                    `${project.projectNo} was updated in the system`
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
        title="Edit Project"
        width={720}
        onClose={onCLose}
        visible={showEditDrawer}
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
                        name="id"
                        label="ID"
                        rules={[{required: true, message: 'Please enter project Id'}]}
                    >
                        <Input placeholder="Please enter project Id"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="name"
                        rules={[{required: true, message: 'Please enter project name'}]}
                    >
                        <Input placeholder="Please enter project name"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="projectNo"
                        label="projectNo"
                        rules={[{required: true, message: 'Please enter project projectNo'}]}
                    >
                        <Input placeholder="Please enter project projectNo"/>
                    </Form.Item>
                </Col>
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
export default ProjectEditDrawerForm;