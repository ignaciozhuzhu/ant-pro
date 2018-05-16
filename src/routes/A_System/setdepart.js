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

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, data_key, data_name } = props;
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="id">
        {form.getFieldDecorator('key', {
          rules: [{ required: true, message: '请输入...' }],
          initialValue:data_key,
        })(<Input disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="专长名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入...' }],
          initialValue:data_name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ setdepart, loading }) => ({
  setdepart,
  loading: loading.models.setdepart,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    //表格传递到弹框的值
    data_key: 0,
    data_name: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'setdepart/fetch',
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
      type: 'setdepart/fetch',
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
      type: 'setdepart/fetch',
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
        type: 'setdepart/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag, record) => {
    if (record)
      this.setState({
        modalVisible: !!flag,
        data_key: record.key,
        data_name: record.depName,
      });
    else
      this.setState({
        modalVisible: !!flag,
      });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'setdepart/add',
      payload: {
        name: fields.name,
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
      type: 'setdepart/remove',
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
      type: 'setdepart/fetch',
    });
  }

  render() {
    const { setdepart: { data }, loading } = this.props;
    const { selectedRows, modalVisible, data_key, data_name } = this.state;

    const columns = [{
      title: 'id',
      dataIndex: 'key',
    }, {
      title: '专长名称',
      dataIndex: 'depName',
    }, {
      title: '操作',
      render: (value, record) => (
        <Fragment>
            <a onClick={() => this.handleModalVisible(true,record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDel(record)}>删除</a>
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
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,{key:0})}>
                新增
              </Button>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} data_key={data_key} data_name={data_name} />
      </PageHeaderLayout>
    );
  }
}