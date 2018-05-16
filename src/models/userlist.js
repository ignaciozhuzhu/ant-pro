import { queryUserlist, addUserlist, removeUserlist } from '../services/api';

export default {
  namespace: 'userlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      console.log('models/fetch')
      const response = yield call(queryUserlist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addUserlist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUserlist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};