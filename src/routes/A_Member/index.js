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
  Modal,
  message,
  Badge,
  Divider,
  Avatar,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import $ from 'jquery'

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
  .map(key => obj[key])
  .join(',');
const statusMap = ['default', 'processing'];
const status = ['已下架', '已上架'];

@connect(({ userlist, loading }) => ({
  userlist,
  loading: loading.models.userlist,
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
    dispatch({
      type: 'userlist/fetch',
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
      type: 'userlist/fetch',
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
      type: 'userlist/fetch',
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
        //updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'userlist/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'userlist/add',
      payload: {
        name: fields.name,
        sort: fields.sort,
        isList: fields.status,
        id: fields.key,
      },
    });

    message.success('操作成功');
    this.setState({
      modalVisible: false,
    });
    this.tableUpdate()
  };

  handleDel = fields => {
    const { selectedRows } = this.state;
    this.props.dispatch({
      type: 'userlist/remove',
      payload: {
        id: fields.key,
      },
    });

    message.success('操作成功');
    this.setState({
      modalVisible: false,
    });
    this.tableUpdate()

  };
  tableUpdate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/fetch',
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名字">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电话">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
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
    const { userlist: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [{
      title: '昵称',
      dataIndex: 'nickName',
    }, {
      title: '头像',
      dataIndex: 'avatar',
      render(val) {
        return <Avatar src={val} shape="square" size="large" />
      }
    }, {
      title: '姓名',
      dataIndex: 'realName',
    }, {
      title: '电话',
      dataIndex: 'phone',
    }, {
      title: '注册时间',
      dataIndex: 'regTime',
    }, {
      title: '身高',
      dataIndex: 'height',
    }, {
      title: '体重',
      dataIndex: 'weight',
    }, {
      title: '年龄',
      dataIndex: 'age',
    }, {
      title: '氧分',
      dataIndex: 'oxygen',
    }];

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
      </PageHeaderLayout>
    );
  }
}