import { querySethospital, addSethospital, removeSethospital } from '../services/api';

export default {
  namespace: 'sethospital',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      console.log('models/fetch')
      const response = yield call(querySethospital, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addSethospital, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeSethospital, payload);
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