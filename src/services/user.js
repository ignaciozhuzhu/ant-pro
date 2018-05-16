import request from '../utils/request';
import { getServer } from '../utils/common'

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  // return request('/api/currentUser');
  return request(getServer() + `mhshiHandler.ashx?fn=getmockuser`)
}