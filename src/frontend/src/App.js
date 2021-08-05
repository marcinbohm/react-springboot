import React, {useState, useEffect} from 'react'
import {deleteProject, getAllProjects} from "./client";
import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Badge,
    Tag,
    Avatar,
    Radio,
    Popconfirm,
    Input,
    Space
} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ProjectDrawerForm from "./AddProjectDrawerForm";
import ProjectEditDrawerForm from "./EditProjectDrawerForm";
import './App.css';
import {errorNotification, successNotification} from "./Notification";
const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const removeProject = (projectId, callback) => {
    deleteProject(projectId).then(() => {
        successNotification("Project deleted", `Project with id ${projectId} was deleted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}


const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
function App() {
    const [projects, setProjects] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showEditDrawer, setEditShowDrawer] = useState(false);
    class DataTable extends React.Component {
        state = {
            searchText: '',
            searchedColumn: '',
        };

        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: text =>
                this.state.searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[this.state.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });

        handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            });
        };

        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };

        render() {
            const columns = (fetchProjects, showEditDrawer, setEditShowDrawer )=> [
                {
                    title: 'Id',
                    dataIndex: 'id',
                    key: 'id',
                    ...this.getColumnSearchProps('id')
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    ...this.getColumnSearchProps('name')
                },
                {
                    title: 'ProjectNo',
                    dataIndex: 'projectNo',
                    key: 'projectNo',
                    ...this.getColumnSearchProps('projectNo')
                },
                {
                    title: 'ProjectCode',
                    dataIndex: 'projectCode',
                    key: 'projectCode',
                    ...this.getColumnSearchProps('projectCode')
                },
                {
                    title: 'Actions',
                    key: 'actions',
                    render: (text, project) =>
                        <Radio.Group>
                            <Popconfirm
                                placement='topRight'
                                title={`Are you sure to delete ${project.name}`}
                                onConfirm={() => removeProject(project.id, fetchProjects)}
                                okText='Yes'
                                cancelText='No'>
                                <Radio.Button value="small">Delete</Radio.Button>
                            </Popconfirm>
                            <Radio.Button
                                onClick={() => setEditShowDrawer(true)}
                                value="small">Edit
                            </Radio.Button>
                        </Radio.Group>
                }
            ];
            return <Table columns={columns(fetchProjects, showEditDrawer, setEditShowDrawer)} dataSource={projects} />;
        }
    }
    const fetchProjects = () =>
        getAllProjects()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProjects(data);
            }).catch(err => {
            console.log(err.response)
            err.response.json().then(res => {
                console.log(res);
                errorNotification(
                    "There was an issue",
                    `${res.message} [${res.status}] [${res.error}]`
                )
            });
        }).finally(() => setFetching(false))

    useEffect(() => {
        console.log("component is mounted");
        fetchProjects();
    }, []);

    const renderProjects = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (projects.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Project
                </Button>
                <ProjectDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchProjects={fetchProjects}
                />
                <Empty/>
            </>
        }
        return <>

            <ProjectDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchProjects={fetchProjects}
            />
            <ProjectEditDrawerForm
                showEditDrawer={showEditDrawer}
                setEditShowDrawer={setEditShowDrawer}
                fetchProjects={fetchProjects}
            />
            <>
                <Tag>Number of projects</Tag>
                <Badge count={projects.length} className="site-badge-count-4"/>
                <br/><br/>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Project
                </Button>
            </>
            <DataTable />
        </>
    }
    return <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderProjects()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>PERITUS-ACT 2021</Footer>
        </Layout>
    </Layout>
}
export default App;