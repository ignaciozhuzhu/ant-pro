import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Avatar,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Upload from './upload'

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
  .map(key => obj[key])
  .join(',');
const statusMap = ['default', 'processing'];
const status = ['已下架', '已上架'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('no', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('avatar', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ banner, loading }) => ({
  banner,
  loading: loading.models.banner,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    console.log('componentDidMount')
    dispatch({
      type: 'banner/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'banner/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'banner/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'banner/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'banner/add',
      payload: {
        no: fields.no,
        avatar: fields.avatar,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  handleDel = fields => {
    const { selectedRows } = this.state;
    this.props.dispatch({
      type: 'banner/remove',
      payload: {
        no: 'TradeCode 1',
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">已上架</Option>
                  <Option value="0">已下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { banner: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [{
      title: '名称',
      dataIndex: 'no',
    }, {
      title: '图片',
      dataIndex: 'avatar',
      render(val) {
        return <Avatar src={atob(val)} shape="square" size="large" />
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      filters: [{
        text: status[0],
        value: 0,
      }, {
        text: status[1],
        value: 1,
      }],
      onFilter: (value, record) => record.status.toString() === value,
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    }, {
      title: '排序',
      dataIndex: 'sort',
    }, {
      title: '操作',
      render: () => (
        <Fragment>
            <a onClick={() => this.handleModalVisible(true)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDel()}>删除</a>
          </Fragment>
      ),
    }, ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <Upload />
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowSelectionFlag="false"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}