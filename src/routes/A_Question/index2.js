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
  const { modalVisible, form, handleAdd, handleModalVisible, data_id, data_content, data_qid } = props;
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="回答内容">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: '请输入...' }],
          initialValue:data_content
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="问题id">
         {form.getFieldDecorator('qid', {
          rules: [{ required: true, message: '请输入...' }],
          initialValue:data_qid})(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ answer, loading }) => ({
  answer,
  loading: loading.models.answer,
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
      type: 'answer/fetch',
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
      type: 'answer/fetch',
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
      type: 'answer/fetch',
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
        type: 'answer/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag, record) => {
    console.log(record)
    if (record)
      this.setState({
        modalVisible: !!flag,
        data_id: record.id,
        data_content: record.acontent,
        data_qid: record.qid,
      });
    else
      this.setState({
        modalVisible: !!flag,
      });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'answer/add',
      payload: {
        content: fields.content,
        qid: fields.qid,
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
      type: 'answer/remove',
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
      type: 'answer/fetch',
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="问题">
              {getFieldDecorator('qcontent')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="医生">
              {getFieldDecorator('answer')(<Input placeholder="请输入" />)}
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
    const { answer: { data }, loading } = this.props;
    const { selectedRows, modalVisible, data_id, data_content, data_qid } = this.state;

    const columns = [{
      title: '医生',
      dataIndex: 'answer',
    }, {
      title: '回答内容',
      dataIndex: 'acontent',
      render: (value) => (
        <div>{value?(value.length>18?value.substr(0,16)+'...':value):''}</div>
      ),
    }, {
      title: '问题',
      dataIndex: 'qcontent',
      render: (value) => (
        <div>{value?(value.length>18?value.substr(0,16)+'...':value):''}</div>
      ),
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} data_id={data_id} data_qid={data_qid} data_content={data_content} />
      </PageHeaderLayout>
    );
  }
}