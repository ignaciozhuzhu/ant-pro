import { queryDoclist, addDoclist, removeDoclist } from '../services/api';

export default {
  namespace: 'doclist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      console.log('models/fetch')
      const response = yield call(queryDoclist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addDoclist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeDoclist, payload);
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