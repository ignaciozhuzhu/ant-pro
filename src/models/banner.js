import { queryBanner, addBanner, removeBanner } from '../services/api';

export default {
  namespace: 'banner',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      console.log('models/fetch')
      const response = yield call(queryBanner, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addBanner, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeBanner, payload);
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