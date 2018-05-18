import { stringify } from 'qs';
import request from '../utils/request';
import { getServer } from '../utils/common'

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  console.log('services/queryRule')
  return request(`/api/rule?${stringify(params)}`);
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

/*banner*********************************************************/
export async function queryBanner(params) {
  if (params)
    return request(getServer() + `mhshiHandler.ashx?fn=getbanner&name=${params.name}&isList=${params.status}`);
  else
    return request(getServer() + `mhshiHandler.ashx?fn=getbanner`);
}

export async function addBanner(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=editbanner&name=${params.name}&sort=${params.sort}&isList=${params.isList}&id=${params.id}`)
}

export async function removeBanner(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=delbanner&id=${params.id}`)
}
/**********************************************************/


/*ques*********************************************************/
export async function queryQues(params) {
  if (params)
    return request(getServer() + `mhshiHandler.ashx?fn=getquestionlistadmin&content=${params.content}&direType=${params.direType}&docName=${params.docName}`);
  else
    return request(getServer() + `mhshiHandler.ashx?fn=getquestionlistadmin`);
}

export async function addQues(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=updatequestionadmin&content=${params.content}&direType=${params.direType}&id=${params.id}`)
}

export async function removeQues(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=deletequestionadmin&id=${params.id}`)
}
/**********************************************************/

/*answer*********************************************************/
export async function queryAnswer(params) {
  if (params)
    return request(getServer() + `mhshiHandler.ashx?fn=getanswerlistadmin&qcontent=${params.qcontent}&answer=${params.answer}`);
  else
    return request(getServer() + `mhshiHandler.ashx?fn=getanswerlistadmin`);
}

export async function addAnswer(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=updateansweradmin&qid=${params.qid}&content=${params.content}&id=${params.id}`)
}

export async function removeAnswer(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=deleteansweradmin&id=${params.id}`)
}
/**********************************************************/


/*userlist*********************************************************/
export async function queryUserlist(params) {
  if (params)
    return request(getServer() + `mhshiHandler.ashx?fn=getuserlist&name=${params.name}&phone=${params.phone}`);
  else
    return request(getServer() + `mhshiHandler.ashx?fn=getuserlist`);
}

export async function addUserlist(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=editbanner&name=${params.name}&sort=${params.sort}&isList=${params.isList}&id=${params.id}`)
}

export async function removeUserlist(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=delbanner&id=${params.id}`)
}
/**********************************************************/

/*doclist*********************************************************/
export async function queryDoclist(params) {
  if (params)
    return request(getServer() + `mhshiHandler.ashx?fn=getdoclist&name=${params.name}&phone=${params.phone}`);
  else
    return request(getServer() + `mhshiHandler.ashx?fn=getdoclist`);
}

export async function addDoclist(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=editbanner&name=${params.name}&sort=${params.sort}&isList=${params.isList}&id=${params.id}`)
}

export async function removeDoclist(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=delbanner&id=${params.id}`)
}
/**********************************************************/

/*recharge 充值*********************************************************/
export async function queryRecharge(params) {
  if (params)
    return request(getServer() + `mhshiHandler.ashx?fn=getrechargelist&name=${params.name}&beginDate=${params.beginDate}&endDate=${params.endDate}`);
  else
    return request(getServer() + `mhshiHandler.ashx?fn=getrechargelist`);
}

export async function addRecharge(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=editbanner&name=${params.name}&sort=${params.sort}&isList=${params.isList}&id=${params.id}`)
}

export async function removeRecharge(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=delbanner&id=${params.id}`)
}
/**********************************************************/

/*withdraw 提现*********************************************************/
export async function queryWithdraw(params) {
  if (params)
    return request(getServer() + `mhshiHandler.ashx?fn=getwithdrawlist&name=${params.name}&phone=${params.phone}`);
  else
    return request(getServer() + `mhshiHandler.ashx?fn=getwithdrawlist`);
}

export async function addWithdraw(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=editbanner&name=${params.name}&sort=${params.sort}&isList=${params.isList}&id=${params.id}`)
}

export async function removeWithdraw(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=delbanner&id=${params.id}`)
}
/**********************************************************/

/*医院配置*********************************************************/
export async function querySethospital(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=gethospitallist`);
}

export async function addSethospital(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=hospitalupdate&name=${params.name}&id=${params.id}`)
}

export async function removeSethospital(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=hospitaldelete&id=${params.id}`)
}
/**********************************************************/


/*专长配置*********************************************************/
export async function querySetdepart(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=getdepartlist`);
}

export async function addSetdepart(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=departupdate&name=${params.name}&id=${params.id}`)
}

export async function removeSetdepart(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=departdelete&id=${params.id}`)
}
/**********************************************************/

/*职称配置*********************************************************/
export async function querySettitle(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=gettitlelist`);
}

export async function addSettitle(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=titleupdate&name=${params.name}&id=${params.id}`)
}

export async function removeSettitle(params) {
  return request(getServer() + `mhshiHandler.ashx?fn=titledelete&id=${params.id}`)
}
/**********************************************************/

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  console.log('ESLINT', process.env)
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}