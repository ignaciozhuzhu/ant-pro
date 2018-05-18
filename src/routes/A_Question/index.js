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

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, data_id, data_content, data_direType } = props;
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
        {form.getFieldDecorator('id', {
          rules: [{ required: true, message: '请输入...' }],
          initialValue:data_id,
        })(<Input disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="问题">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: '请输入...' }],
          initialValue:data_content
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
         {form.getFieldDecorator('direType', {
          rules: [{ required: true, message: '请选择...' }],
          initialValue:data_direType})(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">更年期营养</Option>
                  <Option value="2">术后康复</Option>
                  <Option value="3">体重管理</Option>
                  <Option value="4">其他</Option>
                </Select>
              )}
      </FormItem>
    </Modal>
  );
});

@connect(({ ques, loading }) => ({
  ques,
  loading: loading.models.ques,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    //表格传递到弹框的值
    data_id: 0,
    data_content: '',
    data_direType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ques/fetch',
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
      type: 'ques/fetch',
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
      type: 'ques/fetch',
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
        type: 'ques/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag, record) => {
    if (record)
      this.setState({
        modalVisible: !!flag,
        data_id: record.id,
        data_content: record.content,
        data_direType: record.direType,
      });
    else
      this.setState({
        modalVisible: !!flag,
      });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'ques/add',
      payload: {
        content: fields.content,
        direType: fields.direType,
        id: fields.id,
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
      type: 'ques/remove',
      payload: {
        id: fields.id,
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
      type: 'ques/fetch',
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="问题">
              {getFieldDecorator('content')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('direType')(<Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">更年期营养</Option>
                  <Option value="2">术后康复</Option>
                  <Option value="3">体重管理</Option>
                  <Option value="4">其他</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="医生">
              {getFieldDecorator('docName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
    const { ques: { data }, loading } = this.props;
    const { selectedRows, modalVisible, data_id, data_content, data_direType } = this.state;

    const columns = [{
      title: 'id',
      dataIndex: 'id',
    }, {
      title: '问题',
      dataIndex: 'content',
      render: (value) => (
        <div>{value?(value.length>18?value.substr(0,16)+'...':value):''}</div>
      ),
    }, {
      title: '类型',
      dataIndex: 'direType',
      render: (value) => (
        <div>{value==1?'更年期营养':
              value==2?'术后康复':
              value==3?'体重管理':
              value==4?'其他':''}</div>
      ),
    }, {
      title: '提问者',
      dataIndex: 'nickName',
    }, {
      title: '医生',
      dataIndex: 'docName',
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
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,{id:0})}>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} data_id={data_id} data_direType={data_direType} data_content={data_content} />
      </PageHeaderLayout>
    );
  }
}